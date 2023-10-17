import { Controller, Get, Post } from '@nestjs/common';
import { EventService } from './event.service';

@Controller()
export class EventController {
  constructor(private readonly appService: EventService) { }

  @Post('event')
  createEvent(): string {
    return this.appService.getHello();
  }
}
