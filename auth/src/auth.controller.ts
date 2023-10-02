import { Controller, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { Request as RequestExpress } from 'express';
import { GenerateTokensDto } from './shared/dtos/generate-tokens.dto';
import { ValidateRecoveryTokenDto } from './shared/dtos/validate-recovery.dto';

@Controller()
export class AuthController {
  constructor(private readonly appService: AuthService) { }

  @MessagePattern({ cmd: 'generate-tokens' })
  generateTokens(data: GenerateTokensDto) {
    return this.appService.generateTokens(data);
  }

  @Get('refresh')
  refresh(@Request() req: RequestExpress) {
    return this.appService.refresh(req);
  }

  @MessagePattern({ cmd: 'validate-recovery-token' })
  validateRecoveryToken(data: ValidateRecoveryTokenDto) {
    return this.appService.recovery(data);
  }
}
