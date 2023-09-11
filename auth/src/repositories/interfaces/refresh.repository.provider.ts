import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'src/shared/enums/dataSource.enum';
import { PrismaService } from 'src/database/prisma.service';
import { REFRESH_REPOSITORY_TOKEN } from './refresh.repository.interface';
import { RefreshPrismaRepository } from '../implementations/refresh.prisma.repository';
import { RefreshInMemoryRepository } from '../implementations/refresh.in-memory.repository';

export function provideRefreshRepository(): Provider[] {
  return [
    {
      provide: REFRESH_REPOSITORY_TOKEN,
      useFactory: async (
        dependenciesProvider: RefreshRefreshDependenciesProvider,
      ) => provideRefreshRepositoryFactory(dependenciesProvider),
      inject: [RefreshRefreshDependenciesProvider],
    },
    RefreshRefreshDependenciesProvider,
  ];
}

async function provideRefreshRepositoryFactory(
  dependenciesProvider: RefreshRefreshDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;
  switch (process.env.DATABASE_DATASOURCE) {
    case DataSource.PRISMA:
      return new RefreshPrismaRepository(dependenciesProvider.prisma);
    case DataSource.MEMORY:
    default:
      return new RefreshInMemoryRepository();
  }
}

@Injectable()
export class RefreshRefreshDependenciesProvider {
  constructor(public prisma: PrismaService) {}
}
