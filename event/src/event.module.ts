import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { provideEventRepository } from './repositories/event.repository.provider';

@Module({
  imports: [],
  controllers: [EventController],
  providers: [EventService, ...provideEventRepository(),],
})
export class EventModule { }
