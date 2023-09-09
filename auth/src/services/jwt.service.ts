import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { v4 as uuidv4 } from 'uuid';
import { JwtService as JwtNest } from '@nestjs/jwt';
import { UserPayload } from 'src/models/user-payload.model';
import { UserToken } from 'src/models/user-token.model';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtNest: JwtNest,
    private readonly configService: ConfigService,
  ) {}
  async generateTokens(user_id, email): Promise<UserToken> {
    const tokenPayload: UserPayload = {
      sub: user_id,
      email,
    };

    const jwtJti = uuidv4();

    const refreshTokenPayload: UserPayload = {
      sub: user_id,
      email,
      jti: jwtJti,
    };

    const accessTokenHeader = {
      kid: 'access',
      alg: 'HS256',
    };

    const refreshTokenHeader = {
      kid: 'refresh',
      alg: 'HS256',
    };

    const [access_token, refresh_token] = [
      this.jwtNest.sign(tokenPayload, {
        privateKey: this.configService.get('jwt.accessPrivateKey'),
        expiresIn: this.configService.get('jwt.accessExpiresIn'),
        algorithm: 'HS256',
        header: accessTokenHeader,
      }),
      this.jwtNest.sign(refreshTokenPayload, {
        privateKey: this.configService.get('jwt.refreshPrivateKey'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
        algorithm: 'HS256',
        header: refreshTokenHeader,
      }),
    ];
    return {
      access_token,
      refresh_token,
      jti: jwtJti,
    };
  }

  decodeToken(token: string): UserPayload {
    const decodedToken = this.jwtNest.decode(token);
    return decodedToken as UserPayload;
  }

  verifyToken(token: string, key: string): UserPayload {
    const decodedToken = this.jwtNest.verify(token, { secret: key });
    return decodedToken as UserPayload;
  }

  generateActivateToken(email: string) {
    const tokenPayload = {
      email: email,
    };

    const tokenHeader = {
      kid: 'activate',
      alg: 'HS256',
    };

    const activateToken = this.jwtNest.sign(tokenPayload, {
      privateKey: this.configService.get('jwt.activatePrivateKey'),
      expiresIn: this.configService.get('jwt.activateExpiresIn'),
      algorithm: 'HS256',
      header: tokenHeader,
    });

    return activateToken;
  }

  generateRecoveryToken(hash: string, email: string) {
    const tokenPayload = {
      email: email,
    };
    const tokenHeader = {
      kid: 'recovery',
      alg: 'HS256',
    };
    const recoveryToken = this.jwtNest.sign(tokenPayload, {
      secret: hash,
      expiresIn: this.configService.get('jwt.recoveryExpiresIn'),
      header: tokenHeader,
    });

    return recoveryToken;
  }
}
