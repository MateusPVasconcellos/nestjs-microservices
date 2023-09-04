import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AppService } from '../app.service';

export class TokenPayload {
  sub?: string;
  email?: string;
  iat?: number;
  exp?: number;
  jti?: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService, private authService: AppService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.refreshPrivateKey'),
      algorithms: ['HS256'],
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayload) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    await this.authService.validateRefreshToken(refreshToken, payload.sub);

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
