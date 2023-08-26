import { Prisma } from '@prisma/client';
import { UserRefreshToken } from '../entities/user-refresh-token.entity';

export interface AuthRepository {
  update(params: {
    where: Prisma.UserRefreshTokenWhereUniqueInput;
    data: Prisma.UserRefreshTokenUpdateInput;
  });
  create(params: { data: Prisma.UserRefreshTokenCreateInput });
  delete(params: { where: Prisma.UserRefreshTokenWhereUniqueInput });
  findOne(params: {
    where: Prisma.UserRefreshTokenWhereUniqueInput;
  }): Promise<UserRefreshToken>;
}

export const AUTH_REPOSITORY_TOKEN = 'auth-repository-token';
