import { UserRefreshToken } from '../../entities/user-refresh-token.entity';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
import { RefreshRepository } from '../interfaces/refresh.repository.interface';

export class RefreshPrismaRepository implements RefreshRepository {
  constructor(private prisma: PrismaService) {}
  update(params: {
    where: Prisma.UserRefreshTokenWhereUniqueInput;
    data: Prisma.UserRefreshTokenUpdateInput;
  }) {
    return this.prisma.userRefreshToken.update({
      where: params.where,
      data: params.data,
    });
  }

  findOne(params: {
    where: Prisma.UserRefreshTokenWhereUniqueInput;
  }): Promise<UserRefreshToken> {
    return this.prisma.userRefreshToken.findFirst({
      where: params.where,
    });
  }

  delete(params: { where: Prisma.UserRefreshTokenWhereUniqueInput }) {
    return this.prisma.userRefreshToken.deleteMany({ where: params.where });
  }

  create(params: { data: Prisma.UserRefreshTokenCreateInput }) {
    return this.prisma.userRefreshToken.create({ data: params.data });
  }
}
