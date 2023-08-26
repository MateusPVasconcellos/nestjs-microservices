import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'generate-tokens' })
  generateTokens(data: any) {
    return this.appService.generateTokens(data.user_id, data.email);
  }
}
