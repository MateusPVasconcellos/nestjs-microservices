import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(createUserDto) {
    createUserDto.roleEnum = { connect: { id: 'clllg5l2d0000ty80srs1wnn1' } };
    const user = await this.prisma.user.findFirst({
      where: { email: createUserDto.email },
    });

    if (user) {
      throw new ConflictException('There is already a user with this email.');
    }
    delete createUserDto.password_confirmation;
    return await this.prisma.user.create({ data: createUserDto });
  }
}
