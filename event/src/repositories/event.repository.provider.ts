import { Injectable, Provider } from '@nestjs/common';
import { EVENT_REPOSITORY_TOKEN } from './event.repository.interface';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'src/shared/enums/dataSource.enum';
import { EventPrismaRepository } from './implementations/event.prisma.repository';
import { EventInMemoryRepository } from './implementations/event.in-memory.repository';
import { PrismaService } from 'src/database/prisma.service';

export function provideEventRepository(): Provider[] {
  return [
    {
      provide: EVENT_REPOSITORY_TOKEN,
      useFactory: async (dependenciesProvider: EventRepoDependenciesProvider) =>
        provideEventRepositoryFactory(dependenciesProvider),
      inject: [EventRepoDependenciesProvider],
    },
    EventRepoDependenciesProvider,
  ];
}

async function provideEventRepositoryFactory(
  dependenciesProvider: EventRepoDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;
  switch (process.env.DATABASE_DATASOURCE) {
    case DataSource.PRISMA:
      return new EventPrismaRepository(dependenciesProvider.prisma);
    case DataSource.MEMORY:
    default:
      return new EventInMemoryRepository();
  }
}

@Injectable()
export class EventRepoDependenciesProvider {
  constructor(public prisma: PrismaService) { }
}
