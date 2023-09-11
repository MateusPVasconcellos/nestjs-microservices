import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'src/shared/enums/dataSource.enum';
import { PrismaService } from 'src/database/prisma.service';
import { RECOVERY_REPOSITORY_TOKEN } from './recovery.repository.interface';
import { RecoveryPrismaRepository } from '../implementations/recovery.prisma.repository copy';
import { RecoveryInMemoryRepository } from '../implementations/recovery.in-memory.repository';

export function provideRecoveryRepository(): Provider[] {
  return [
    {
      provide: RECOVERY_REPOSITORY_TOKEN,
      useFactory: async (dependenciesProvider: RecoveryDependenciesProvider) =>
        provideRecoveryRepositoryFactory(dependenciesProvider),
      inject: [RecoveryDependenciesProvider],
    },
    RecoveryDependenciesProvider,
  ];
}

async function provideRecoveryRepositoryFactory(
  dependenciesProvider: RecoveryDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;
  switch (process.env.DATABASE_DATASOURCE) {
    case DataSource.PRISMA:
      return new RecoveryPrismaRepository(dependenciesProvider.prisma);
    case DataSource.MEMORY:
    default:
      return new RecoveryInMemoryRepository();
  }
}

@Injectable()
export class RecoveryDependenciesProvider {
  constructor(public prisma: PrismaService) {}
}
