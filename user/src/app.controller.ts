import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './shared/dtos/create-user.dto';
import { SigninDto } from './shared/dtos/signin.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.appService.createUser(createUserDto);
  }

  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.appService.signin(signinDto);
  }
}
