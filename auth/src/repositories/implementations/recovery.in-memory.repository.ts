/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma, UserRecoveryToken } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { RecoveryRepository } from '../interfaces/recovery.repository.interface';

export class RecoveryInMemoryRepository implements RecoveryRepository {
  upsert(params: {
    where: Prisma.UserRecoveryTokenWhereUniqueInput;
    create:
      | (Prisma.Without<
          Prisma.UserRecoveryTokenCreateInput,
          Prisma.UserRecoveryTokenUncheckedCreateInput
        > &
          Prisma.UserRecoveryTokenUncheckedCreateInput)
      | (Prisma.Without<
          Prisma.UserRecoveryTokenUncheckedCreateInput,
          Prisma.UserRecoveryTokenCreateInput
        > &
          Prisma.UserRecoveryTokenCreateInput);
    update:
      | (Prisma.Without<
          Prisma.UserRecoveryTokenUpdateInput,
          Prisma.UserRecoveryTokenUncheckedUpdateInput
        > &
          Prisma.UserRecoveryTokenUncheckedUpdateInput)
      | (Prisma.Without<
          Prisma.UserRecoveryTokenUncheckedUpdateInput,
          Prisma.UserRecoveryTokenUpdateInput
        > &
          Prisma.UserRecoveryTokenUpdateInput);
  }) {
    throw new Error('Method not implemented.');
  }

  update(params: {
    where: Prisma.UserRecoveryTokenWhereUniqueInput;
    data: Prisma.UserRecoveryTokenUpdateInput;
  }) {
    throw new Error('Method not implemented.');
  }
  create(params: { data: Prisma.UserRecoveryTokenCreateInput }) {
    throw new Error('Method not implemented.');
  }
  delete(params: { where: Prisma.UserRecoveryTokenWhereUniqueInput }) {
    throw new Error('Method not implemented.');
  }
  findOne(params: {
    where: Prisma.UserRecoveryTokenWhereUniqueInput;
  }): Promise<UserRecoveryToken> {
    throw new Error('Method not implemented.');
  }
}
