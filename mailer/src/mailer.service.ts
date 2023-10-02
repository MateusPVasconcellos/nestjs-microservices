import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  constructor() { }
  getHello(): string {
    return 'Hello World!';
  }
}
