import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private usersService: UsersService) {
    super({ usernameField: 'email' });
  }

  validate(email: string, password: string) {
    return this.usersService.validateUser(email, password);
  }
}
