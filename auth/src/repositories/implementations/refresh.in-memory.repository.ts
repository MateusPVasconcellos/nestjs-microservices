/* eslint-disable @typescript-eslint/no-unused-vars */

import { UserRefreshToken } from '../../entities/user-refresh-token.entity';

import { Prisma } from '@prisma/client';
import { RefreshRepository } from '../interfaces/refresh.repository.interface';

export class RefreshInMemoryRepository implements RefreshRepository {
  upsert(params: {
    where: Prisma.UserRefreshTokenWhereUniqueInput;
    create:
      | (Prisma.Without<
          Prisma.UserRefreshTokenCreateInput,
          Prisma.UserRefreshTokenUncheckedCreateInput
        > &
          Prisma.UserRefreshTokenUncheckedCreateInput)
      | (Prisma.Without<
          Prisma.UserRefreshTokenUncheckedCreateInput,
          Prisma.UserRefreshTokenCreateInput
        > &
          Prisma.UserRefreshTokenCreateInput);
    update:
      | (Prisma.Without<
          Prisma.UserRefreshTokenUpdateInput,
          Prisma.UserRefreshTokenUncheckedUpdateInput
        > &
          Prisma.UserRefreshTokenUncheckedUpdateInput)
      | (Prisma.Without<
          Prisma.UserRefreshTokenUncheckedUpdateInput,
          Prisma.UserRefreshTokenUpdateInput
        > &
          Prisma.UserRefreshTokenUpdateInput);
  }) {
    throw new Error('Method not implemented.');
  }
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
