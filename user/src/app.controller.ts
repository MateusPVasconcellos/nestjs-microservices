import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './app.service';
import { CreateUserDto } from './shared/dtos/create-user.dto';
import { SigninDto } from './shared/dtos/signin.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class UsersController {
  constructor(private readonly appService: UsersService) {}

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
}
