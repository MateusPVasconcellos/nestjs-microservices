import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  USERS_REPOSITORY_TOKEN,
  UsersRepository,
} from './repositories/user.repository.interface';
import { AuthProducerService } from './jobs/auth-producer.service';
import { UserCreatedEvent } from './events/user-created.event';
import { SigninDto } from './shared/dtos/signin.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { validate } from 'class-validator';
import { Request } from 'express';
import { GenerateRecoveryTokenEvent } from './events/generate-recovery-token.event';
import { RecoveryPasswordDto } from './shared/dtos/recovery-password.dto';
import { SigninReturnType } from './shared/types/signin-return.type';
import { User } from './entities/user.entity';
import { CreateUserDto } from './shared/dtos/create-user.dto';
import { LoggerService } from './shared/logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepository,
    private readonly authProducer: AuthProducerService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.contextName = UsersService.name;
  }

  async signin(signinDto: SigninDto): Promise<SigninReturnType> {
    const userStored = await this.usersRepository.findOne({
      where: { email: signinDto.email },
    });
    if (userStored?.active === false) {
      throw new ForbiddenException();
    }

    const tokens = await lastValueFrom(
      this.authClient.send(
        { cmd: 'generate-tokens' },
        { user_id: userStored.id, email: userStored.email },
      ),
    );
    this.loggerService.info(`User ${userStored.id} signin`);
    return tokens;
  }

  async recovery(
    req: Request,
    recoveryPasswordDto: RecoveryPasswordDto,
  ): Promise<User> {
    const jti = req.get('x-jti');
    const user_id = req.get('x-user');

    const isTokenValid = await lastValueFrom(
      this.authClient.send(
        { cmd: 'validate-recovery-token' },
        { user_id, jti },
      ),
    );

    if (!isTokenValid) {
      throw new UnauthorizedException();
    }
    const hashedPassword = await bcrypt.hash(recoveryPasswordDto.password, 8);

    const user = await this.usersRepository.update({
      where: { id: user_id },
      data: { password: hashedPassword },
    });
    this.loggerService.info(`User ${user.id} recovery`);
    return user;
  }

  async resendActivate(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
      include: {
        userDetail: true,
      },
    });
    if (user.active) throw new BadRequestException('User is already active');

    this.loggerService.info(`User ${user.id} resendActivate`);

    return await this.authProducer.resendActivateEmail(
      new UserCreatedEvent(user.userDetail.name, email),
    );
  }

  async sendRecoveryEmail(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
      include: {
        userDetail: true,
      },
    });

    if (!user) throw new BadRequestException();
    this.loggerService.info(`User ${user.id} sendRecoveryEmail`);
    return await this.authProducer.generateRecoveryToken(
      new GenerateRecoveryTokenEvent(email, user.userDetail.name, user.id),
    );
  }

  async activate(req: Request): Promise<User> {
    const email = req.get('x-email');
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user.active) throw new UnauthorizedException();

    const params = {
      where: { email },
      data: { active: true },
    };
    const updatedUser = await this.usersRepository.update(params);
    this.loggerService.info(`User ${updatedUser.id} activate`);
    return updatedUser;
  }

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 8);
    createUserDto.password = hashedPassword;
    const user = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
      include: { userDetail: true },
    });
    createUserDto.password_confirmation = undefined;

    if (user) {
      throw new ConflictException();
    }

    const createdUser = await this.usersRepository.create({
      data: {
        email: createUserDto.email,
        password: createUserDto.password,
        userDetail: {
          create: {
            name: createUserDto.name,
            type_person: createUserDto.type_person,
            cpf_cnpj: createUserDto.cpf_cnpj,
          },
        },
        roleEnum: { connect: { id: 'cln7hdhb30000jd0deu344j9j' } },
      },
    });
    this.loggerService.info(`User ${createdUser.id} created`);
    return await this.authProducer.userCreated(
      new UserCreatedEvent(createUserDto.name, createUserDto.email),
    );
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.findMany({
      include: { userDetail: true, userAddress: true },
    });
    this.loggerService.info(`Called FindAll`);
    return users;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const loginRequestBody = new SigninDto();
    loginRequestBody.email = email;
    loginRequestBody.password = password;

    const validations = await validate(loginRequestBody);

    if (validations.length) {
      throw new BadRequestException(
        validations.reduce((acc, curr) => {
          return [...acc, ...Object.values(curr.constraints)];
        }, []),
      );
    }

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new UnauthorizedException();
  }
}
