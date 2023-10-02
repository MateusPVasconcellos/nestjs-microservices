import { Controller, Get } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller()
export class MailerController {
  constructor(private readonly appService: MailerService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
