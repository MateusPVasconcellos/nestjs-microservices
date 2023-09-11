import { Prisma } from '@prisma/client';
import { UserRecoveryToken } from 'src/entities/user-recovery-token.entity';

export interface RecoveryRepository {
  update(params: {
    where: Prisma.UserRecoveryTokenWhereUniqueInput;
    data: Prisma.UserRecoveryTokenUpdateInput;
  });
  create(params: { data: Prisma.UserRecoveryTokenCreateInput });
  delete(params: { where: Prisma.UserRecoveryTokenWhereUniqueInput });
  findOne(params: {
    where: Prisma.UserRecoveryTokenWhereUniqueInput;
  }): Promise<UserRecoveryToken>;
}

export const RECOVERY_REPOSITORY_TOKEN = 'Recovery-repository-token';
