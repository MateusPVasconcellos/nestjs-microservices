import { Controller, Get, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './shared/dto/create-event.dto';

@Controller()
export class EventController {
  constructor(private readonly appService: EventService) { }

  @Post('event')
  createEvent(event: CreateEventDto) {
    return this.appService.createEvent(event);
  }
}
