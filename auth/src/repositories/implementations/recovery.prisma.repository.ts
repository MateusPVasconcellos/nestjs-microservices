import { PrismaService } from 'src/database/prisma.service';
import { Prisma, UserRecoveryToken } from '@prisma/client';
import { RecoveryRepository } from '../interfaces/recovery.repository.interface';

export class RecoveryPrismaRepository implements RecoveryRepository {
  constructor(private prisma: PrismaService) {}
  update(params: {
    where: Prisma.UserRecoveryTokenWhereUniqueInput;
    data: Prisma.UserRecoveryTokenUpdateInput;
  }) {
    return this.prisma.userRecoveryToken.update({
      where: params.where,
      data: params.data,
    });
  }

  upsert(params: Prisma.UserRecoveryTokenUpsertArgs) {
    return this.prisma.userRecoveryToken.upsert(params);
  }

  findOne(params: {
    where: Prisma.UserRecoveryTokenWhereUniqueInput;
  }): Promise<UserRecoveryToken> {
    return this.prisma.userRecoveryToken.findFirst({
      where: params.where,
    });
  }

  delete(params: { where: Prisma.UserRecoveryTokenWhereUniqueInput }) {
    return this.prisma.userRecoveryToken.deleteMany({ where: params.where });
  }

  create(params: { data: Prisma.UserRecoveryTokenCreateInput }) {
    return this.prisma.userRecoveryToken.create({ data: params.data });
  }
}
