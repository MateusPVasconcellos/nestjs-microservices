import { Prisma } from '@prisma/client';
import { UserRefreshToken } from 'src/entities/user-refresh-token.entity';

export interface RefreshRepository {
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

export const REFRESH_REPOSITORY_TOKEN = 'refresh-repository-token';
