/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma, UserRecoveryToken } from '@prisma/client';
import { RecoveryRepository } from '../interfaces/Recovery.repository.interface';
import { DefaultArgs } from '@prisma/client/runtime/library';

export class RecoveryInMemoryRepository implements RecoveryRepository {
  upsert(params: Prisma.UserRecoveryTokenUpsertArgs<DefaultArgs>) {
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
