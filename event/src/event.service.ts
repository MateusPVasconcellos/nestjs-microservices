import { Inject, Injectable } from '@nestjs/common';
import { CreateEventDto } from './shared/dto/create-event.dto';
import { EVENT_REPOSITORY_TOKEN, EventRepository } from './repositories/event.repository.interface';

@Injectable()
export class EventService {
  constructor(
    @Inject(EVENT_REPOSITORY_TOKEN)
    private readonly eventRepository: EventRepository) { }
  createEvent(event: CreateEventDto) {

  }
}
