import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './shared/dtos/create-user.dto';
import { SigninDto } from './shared/dtos/signin.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request as RequestExpress } from 'express';
import { RecoveryPasswordDto } from './shared/dtos/recovery-password.dto';

@Controller()
export class UsersController {
  constructor(private readonly appService: UsersService) { }

  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.appService.createUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.appService.signin(signinDto);
  }

  @Get('users')
  findAll() {
    return this.appService.findAll();
  }

  @Get('activate')
  activate(@Request() req: RequestExpress) {
    return this.appService.activate(req);
  }

  @Get('resend-activate')
  resendActivate(@Query('email') email: string) {
    return this.appService.resendActivate(email);
  }

  @Get('recovery-email')
  SendRecoveryEmail(@Query('email') email: string) {
    return this.appService.sendRecoveryEmail(email);
  }

  @Post('recovery')
  recovery(
    @Request() req: RequestExpress,
    @Body() recoveryPasswordDto: RecoveryPasswordDto,
  ) {
    return this.appService.recovery(req, recoveryPasswordDto);
  }
}
