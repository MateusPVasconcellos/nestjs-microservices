import { Controller, Get, Query, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { Request as RequestExpress } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'generate-tokens' })
  generateTokens(data: any) {
    return this.appService.generateTokens(data.user_id, data.email);
  }

  @MessagePattern({ cmd: 'generate-activate-token' })
  generateActivateToken(data: any) {
    return this.appService.generateActivateToken(data.email);
  }

  @Get('refresh')
  refresh(@Request() req: RequestExpress) {
    return this.appService.refresh(req);
  }
}
