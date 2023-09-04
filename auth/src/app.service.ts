import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  AUTH_REPOSITORY_TOKEN,
  AuthRepository,
} from './repositories/auth.repository.interface';
import { JwtService } from './services/jwt.service';
import { User } from './models/refresh-request.model';

@Injectable()
export class AppService {
  constructor(
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async refresh(user: User) {
    const tokens = await this.jwtService.generateTokens(user.id, user.email);
    await this.authRepository.update({
      data: {
        jti_refresh_token: tokens.jti,
      },
      where: {
        user_id: user.id,
      },
    });
    //this.loggerService.info(`USER REFRESH: ${JSON.stringify(user)}`);
    tokens.jti = undefined;
    return tokens;
  }

  async validateRefreshToken(token: string, user_id: string) {
    const { jti_refresh_token } = await this.authRepository.findOne({
      where: { user_id: user_id },
    });

    if (jti_refresh_token) {
      const decodedToken = this.jwtService.decodeToken(token);
      if (jti_refresh_token !== decodedToken.jti)
        throw new UnauthorizedException();
    }
  }

  async generateTokens(user_id: string, email: string) {
    const tokens = await this.jwtService.generateTokens(user_id, email);
    const userStoredRefreshToken = await this.authRepository.findOne({
      where: { user_id: user_id },
    });

    if (!userStoredRefreshToken?.jti_refresh_token) {
      await this.authRepository.create({
        data: {
          jti_refresh_token: tokens.jti,
          user_id: user_id,
        },
      });
    }

    await this.authRepository.update({
      data: {
        jti_refresh_token: tokens.jti,
      },
      where: {
        user_id: user_id,
      },
    });

    tokens.jti = undefined;
    return tokens;
  }
}
