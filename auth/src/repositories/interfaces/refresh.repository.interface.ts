import { Prisma } from '@prisma/client';
import { UserRefreshToken } from 'src/entities/user-refresh-token.entity';

export interface RefreshRepository {
  update(params: {
    where: Prisma.UserRefreshTokenWhereUniqueInput;
    data: Prisma.UserRefreshTokenUpdateInput;
  });
  upsert(params: {
    where: Prisma.UserRefreshTokenWhereUniqueInput;
    create: Prisma.XOR<
      Prisma.UserRefreshTokenCreateInput,
      Prisma.UserRefreshTokenUncheckedCreateInput
    >;
    update: Prisma.XOR<
      Prisma.UserRefreshTokenUpdateInput,
      Prisma.UserRefreshTokenUncheckedUpdateInput
    >;
  });
  create(params: { data: Prisma.UserRefreshTokenCreateInput });
  delete(params: { where: Prisma.UserRefreshTokenWhereUniqueInput });
  findOne(params: {
    where: Prisma.UserRefreshTokenWhereUniqueInput;
  }): Promise<UserRefreshToken>;
}

export const REFRESH_REPOSITORY_TOKEN = 'refresh-repository-token';
