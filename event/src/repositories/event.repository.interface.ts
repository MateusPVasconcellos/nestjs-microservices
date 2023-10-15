import { Prisma } from '@prisma/client';
import { Event } from 'src/entities/event.entity';

export interface EventRepository {
  create(params: { data: Prisma.EventCreateInput }): Promise<Event>;
  update(params: {
    where: Prisma.EventWhereUniqueInput;
    data: Prisma.EventUpdateInput;
  }): Promise<Event>;
  findOne(params: {
    where: Prisma.EventWhereUniqueInput;
    include?: Prisma.EventInclude;
  }): Promise<Event>;
  findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EventWhereUniqueInput;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput;
    include?: Prisma.EventInclude;
  }): Promise<Event[]>;
}

export const EVENT_REPOSITORY_TOKEN = 'event-repository-token';
