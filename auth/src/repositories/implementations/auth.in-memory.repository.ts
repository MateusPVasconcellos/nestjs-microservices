/* eslint-disable @typescript-eslint/no-unused-vars */

import { UserRefreshToken } from '../../entities/user-refresh-token.entity';
import { AuthRepository } from '../auth.repository.interface';
import { Prisma } from '@prisma/client';

export class AuthInMemoryRepository implements AuthRepository {
  update(params: {
    where: Prisma.UserRefreshTokenWhereUniqueInput;
    data: Prisma.UserRefreshTokenUpdateInput;
  }) {
    throw new Error('Method not implemented.');
  }
  create(params: { data: Prisma.UserRefreshTokenCreateInput }) {
    throw new Error('Method not implemented.');
  }
  delete(params: { where: Prisma.UserRefreshTokenWhereUniqueInput }) {
    throw new Error('Method not implemented.');
  }
  findOne(params: {
    where: Prisma.UserRefreshTokenWhereUniqueInput;
  }): Promise<UserRefreshToken> {
    throw new Error('Method not implemented.');
  }
}
