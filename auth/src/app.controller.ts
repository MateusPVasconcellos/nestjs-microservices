import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { RefreshRequest } from './models/refresh-request.model';

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

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  refresh(@Request() req: RefreshRequest) {
    return this.appService.refresh(req.user);
  }
}
