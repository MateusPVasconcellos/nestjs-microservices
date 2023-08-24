/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '@prisma/client';
import { User } from '../../entities/user.entity';
import { UsersRepository } from '../user.repository.interface';

export class UsersInMemoryRepository implements UsersRepository {
  create(params: { data: Prisma.UserCreateInput }): Promise<User> {
    throw new Error('Method not implemented.');
  }
  update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findOne(params: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
}
