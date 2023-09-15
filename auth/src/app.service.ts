import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  REFRESH_REPOSITORY_TOKEN,
  RefreshRepository,
} from './repositories/interfaces/refresh.repository.interface';
import { JwtService } from './services/jwt.service';
import { Request } from 'express';
import {
  RECOVERY_REPOSITORY_TOKEN,
  RecoveryRepository,
} from './repositories/interfaces/recovery.repository.interface';

@Injectable()
export class AppService {
  constructor(
    @Inject(REFRESH_REPOSITORY_TOKEN)
    private readonly refreshRepository: RefreshRepository,
    @Inject(RECOVERY_REPOSITORY_TOKEN)
    private readonly recoveryRepository: RecoveryRepository,
    private readonly jwtService: JwtService,
  ) {}

  async refresh(request: Request) {
    const user = request.get('x-user');
    const jti = request.get('x-jti');
    const email = request.get('x-email');
    const { jti_refresh_token } = await this.refreshRepository.findOne({
      where: { user_id: user },
    });

    if (jti_refresh_token) {
      if (jti_refresh_token !== jti) throw new UnauthorizedException();
    }

    const tokens = await this.jwtService.generateTokens(user, email);
    await this.refreshRepository.update({
      data: {
        jti_refresh_token: tokens.jti,
      },
      where: {
        user_id: user,
      },
    });
    //this.loggerService.info(`USER REFRESH: ${JSON.stringify(user)}`);
    tokens.jti = undefined;
    return tokens;
  }

  async recovery(data: any) {
    const { jti_recovery_token } = await this.recoveryRepository.findOne({
      where: { user_id: data.user_id },
    });

    if (jti_recovery_token !== data.jti) return false;

    await this.recoveryRepository.delete({
      where: {
        user_id: data.user_id,
      },
    });

    return true;
    //this.loggerService.info(`USER REFRESH: ${JSON.stringify(user)}`);
  }

  async generateTokens(user_id: string, email: string) {
    const tokens = await this.jwtService.generateTokens(user_id, email);
    const userStoredRefreshToken = await this.refreshRepository.findOne({
      where: { user_id: user_id },
    });

    if (!userStoredRefreshToken?.jti_refresh_token) {
      await this.refreshRepository.create({
        data: {
          jti_refresh_token: tokens.jti,
          user_id: user_id,
        },
      });
    }

    await this.refreshRepository.update({
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

  generateActivateToken(email: string) {
    const tokenPayload = {
      email: email,
    };

    const activateToken = this.jwtService.generateActivateToken(
      tokenPayload.email,
    );

    return activateToken;
  }
}
