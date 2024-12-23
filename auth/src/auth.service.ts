import { Inject, Injectable, UnauthorizedException, InternalServerErrorException, HttpException } from '@nestjs/common';
import { REFRESH_REPOSITORY_TOKEN, RefreshRepository } from './repositories/interfaces/refresh.repository.interface';
import { Request } from 'express';
import { RECOVERY_REPOSITORY_TOKEN, RecoveryRepository } from './repositories/interfaces/recovery.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { GenerateTokensDto } from './shared/dtos/generate-tokens.dto';
import { ValidateRecoveryTokenDto } from './shared/dtos/validate-recovery.dto';
import { RefreshReturnType } from './shared/types/refresh-return.type';
import { GenerateRecoveryTokenEvent } from './events/generate-recovery-token.event';
import { GenerateRecoveryReturnType } from './shared/types/generate-recovery-return.type';
import { GenerateTokensReturnType } from './shared/types/generate-tokens-return.type';
import { UserPayloadType } from './shared/types/user-payload.type';
import { LoggerService } from './shared/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(REFRESH_REPOSITORY_TOKEN)
    private readonly refreshRepository: RefreshRepository,
    @Inject(RECOVERY_REPOSITORY_TOKEN)
    private readonly recoveryRepository: RecoveryRepository,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.contextName = AuthService.name;
  }

  async refresh(request: Request): Promise<RefreshReturnType> {
    try {
      const user_id = request.get('x-user');
      const jti = request.get('x-jti');
      const email = request.get('x-email');
      const { jti_refresh_token } = await this.refreshRepository.findOne({
        where: { user_id },
      });

      if (jti_refresh_token) {
        if (jti_refresh_token !== jti) throw new UnauthorizedException({ context: AuthService.name });
      }

      const jwtJti = uuidv4();

      const tokenPayload: UserPayloadType = {
        sub: user_id,
        email,
      };

      const refreshTokenPayload: UserPayloadType = {
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
        this.jwt.sign(tokenPayload, {
          privateKey: this.configService.get('jwt.accessPrivateKey'),
          expiresIn: this.configService.get('jwt.accessExpiresIn'),
          algorithm: 'HS256',
          header: accessTokenHeader,
        }),
        this.jwt.sign(refreshTokenPayload, {
          privateKey: this.configService.get('jwt.refreshPrivateKey'),
          expiresIn: this.configService.get('jwt.refreshExpiresIn'),
          algorithm: 'HS256',
          header: refreshTokenHeader,
        }),
      ];
      await this.refreshRepository.upsert({
        where: { user_id: user_id },
        create: { user_id: user_id, jti_refresh_token: jwtJti },
        update: { jti_refresh_token: jwtJti },
      });
      this.loggerService.info(`User ${user_id} refresh`);
      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error, 'Failed to refresh tokens');
    }
  }

  async recovery({ user_id, jti }: ValidateRecoveryTokenDto): Promise<boolean> {
    try {
      const { jti_recovery_token } = await this.recoveryRepository.findOne({
        where: { user_id: user_id },
      });

      if (jti_recovery_token !== jti) return false;

      await this.recoveryRepository.delete({
        where: {
          user_id: user_id,
        },
      });

      this.loggerService.info(`User ${user_id} recovery`);
      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error, 'Failed to recover token');
    }
  }

  generateRecoveryToken({ email, user_id }: GenerateRecoveryTokenEvent): GenerateRecoveryReturnType {
    try {
      const jwtJti = uuidv4();
      const tokenPayload = {
        sub: user_id,
        email,
        jti: jwtJti,
      };
      const tokenHeader = {
        kid: 'recovery',
        alg: 'HS256',
      };
      const recoveryToken = this.jwt.sign(tokenPayload, {
        privateKey: this.configService.get('jwt.recoveryPrivateKey'),
        expiresIn: this.configService.get('jwt.recoveryExpiresIn'),
        header: tokenHeader,
      });

      this.loggerService.info(`User ${user_id} generate recovery`);
      return { recoveryToken, jwtJti };
    } catch (error) {
      throw new InternalServerErrorException(error, 'Failed to generate recovery token');
    }
  }

  async generateTokens({ user_id, email }: GenerateTokensDto): Promise<GenerateTokensReturnType> {
    try {
      const jwtJti = uuidv4();
      const tokenPayload: UserPayloadType = {
        sub: user_id,
        email,
      };

      const refreshTokenPayload: UserPayloadType = {
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
        this.jwt.sign(tokenPayload, {
          privateKey: this.configService.get('jwt.accessPrivateKey'),
          expiresIn: this.configService.get('jwt.accessExpiresIn'),
          algorithm: 'HS256',
          header: accessTokenHeader,
        }),
        this.jwt.sign(refreshTokenPayload, {
          privateKey: this.configService.get('jwt.refreshPrivateKey'),
          expiresIn: this.configService.get('jwt.refreshExpiresIn'),
          algorithm: 'HS256',
          header: refreshTokenHeader,
        }),
      ];

      await this.refreshRepository.upsert({
        where: { user_id: user_id },
        create: { user_id: user_id, jti_refresh_token: jwtJti },
        update: { jti_refresh_token: jwtJti },
      });

      this.loggerService.info(`User ${user_id} generate tokens`);
      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error, 'Failed to generate tokens');
    }
  }

  generateActivateToken(email: string): string {
    try {
      const tokenPayload = {
        email: email,
      };
      const tokenHeader = {
        kid: 'activate',
        alg: 'HS256',
      };

      const activateToken = this.jwt.sign(tokenPayload, {
        privateKey: this.configService.get('jwt.activatePrivateKey'),
        expiresIn: this.configService.get('jwt.activateExpiresIn'),
        algorithm: 'HS256',
        header: tokenHeader,
      });

      this.loggerService.info(`User ${email} generate activate`);
      return activateToken;
    } catch (error) {
      throw new InternalServerErrorException(error, 'Failed to generate activation token');
    }
  }
}