/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '@prisma/client';
import { EventRepository } from '../event.repository.interface';
import { Event } from 'src/entities/event.entity';

export class EventInMemoryRepository implements EventRepository {
  create(params: { data: Prisma.EventCreateInput }): Promise<Event> {
    throw new Error('Method not implemented.');
  }
  update(params: {
    where: Prisma.EventWhereUniqueInput;
    data: Prisma.EventUpdateInput;
  }): Promise<Event> {
    throw new Error('Method not implemented.');
  }
  findOne(params: { where: Prisma.EventWhereUniqueInput }): Promise<Event> {
    throw new Error('Method not implemented.');
  }
  findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EventWhereUniqueInput;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput;
  }): Promise<Event[]> {
    throw new Error('Method not implemented.');
  }
}
