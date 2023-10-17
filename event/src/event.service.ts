import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  createEvent(): string {
    return 'Hello World!';
  }
}
