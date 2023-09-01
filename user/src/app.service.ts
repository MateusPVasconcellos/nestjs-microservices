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
import { UserProducerService } from './jobs/user-producer.service';
import { UserCreatedEvent } from './events/user-created.event';
import { SigninDto } from './shared/dtos/signin.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { validate } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepository,
    private readonly usersProducer: UserProducerService,
  ) {}

  async signin(signinDto: SigninDto) {
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

    return tokens;
  }

  async createUser(createUserDto) {
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
        roleEnum: { connect: { id: 'clllg5l2d0000ty80srs1wnn1' } },
      },
    });

    if (createdUser) {
      await this.usersProducer.sendActivateEmail(
        new UserCreatedEvent(createUserDto.name, createUserDto.email),
      );
    }
  }

  async findAll() {
    const users = await this.usersRepository.findMany({
      include: { userDetail: true, userAddress: true },
    });
    return users;
  }

  async validateUser(email: string, password: string) {
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
