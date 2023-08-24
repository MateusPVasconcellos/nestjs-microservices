import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './shared/dto/create-user.dto';
import { ClientProxy } from '@nestjs/microservices/client';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async signup(createUserDto: CreateUserDto) {}
}
