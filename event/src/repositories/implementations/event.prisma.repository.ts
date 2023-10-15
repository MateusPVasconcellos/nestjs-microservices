import { EventRepository } from '../event.repository.interface';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
import { Event } from 'src/entities/event.entity';

export class EventPrismaRepository implements EventRepository {
  constructor(private prisma: PrismaService) { }
  create(params: { data: Prisma.EventCreateInput }): Promise<Event> {
    return this.prisma.event.create({ data: params.data });
  }

  update(params: {
    where: Prisma.EventWhereUniqueInput;
    data: Prisma.EventUpdateInput;
  }): Promise<Event> {
    return this.prisma.event.update({ where: params.where, data: params.data });
  }

  findOne(params: {
    where: Prisma.EventWhereUniqueInput;
    include?: Prisma.EventInclude;
  }): Promise<Event> {
    return this.prisma.event.findFirst({
      where: params.where,
      include: params.include,
    });
  }

  findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EventWhereUniqueInput;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput;
    include?: Prisma.EventInclude;
  }): Promise<Event[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.event.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }
}
