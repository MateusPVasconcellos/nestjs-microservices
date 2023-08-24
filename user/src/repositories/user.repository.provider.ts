import { Injectable, Provider } from '@nestjs/common';
import { USERS_REPOSITORY_TOKEN } from './user.repository.interface';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'src/shared/enums/dataSource.enum';
import { UsersPrismaRepository } from './implementations/user.prisma.repository';
import { UsersInMemoryRepository } from './implementations/users.in-memory.repository';
import { PrismaService } from 'src/database/prisma.service';

export function provideUsersRepository(): Provider[] {
  return [
    {
      provide: USERS_REPOSITORY_TOKEN,
      useFactory: async (dependenciesProvider: UsersRepoDependenciesProvider) =>
        provideUsersRepositoryFactory(dependenciesProvider),
      inject: [UsersRepoDependenciesProvider],
    },
    UsersRepoDependenciesProvider,
  ];
}

async function provideUsersRepositoryFactory(
  dependenciesProvider: UsersRepoDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;
  switch (process.env.DATABASE_DATASOURCE) {
    case DataSource.PRISMA:
      return new UsersPrismaRepository(dependenciesProvider.prisma);
    case DataSource.MEMORY:
    default:
      return new UsersInMemoryRepository();
  }
}

@Injectable()
export class UsersRepoDependenciesProvider {
  constructor(public prisma: PrismaService) {}
}
