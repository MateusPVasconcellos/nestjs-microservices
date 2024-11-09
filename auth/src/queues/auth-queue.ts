import { Controller, HttpException, Inject } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AuthService } from 'src/auth.service';
import { GenerateRecoveryTokenEvent } from 'src/events/generate-recovery-token.event';
import { ActivateEmailEvent } from 'src/events/send-activate-email.event';
import { RecoveryEmailEvent } from 'src/events/send-recovery-email.event';
import { UserCreatedEvent } from 'src/events/user-created.event';
import { MailerProducerService } from 'src/jobs/mailer-producer.service';
import {
  RECOVERY_REPOSITORY_TOKEN,
  RecoveryRepository,
} from 'src/repositories/interfaces/recovery.repository.interface';
import { LoggerService } from 'src/shared/logger/logger.service';
import { extractStackTrace } from 'src/shared/utils/extract-stack-trace';

@Controller()
class AuthQueue {
  constructor(
    private readonly mailerProducer: MailerProducerService,
    @Inject(RECOVERY_REPOSITORY_TOKEN)
    private readonly recoveryRepository: RecoveryRepository,
    private readonly appService: AuthService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.contextName = AuthQueue.name;
  }

  @EventPattern('authQueue.userCreated')
  async generateActivateToken(data: UserCreatedEvent) {
    try {
      this.loggerService.info(`Event authQueue.userCreated received`);
      const token = this.appService.generateActivateToken(data.email);

      await this.mailerProducer.sendActivateEmail(
        new ActivateEmailEvent(data.email, data.name, token),
      );
    } catch (error) {
      this.handleError('authQueue.userCreated', error);
    }
  }

  @EventPattern('authQueue.resendActivateEmail')
  async regenerateActivateToken(data: UserCreatedEvent) {
    try {
      this.loggerService.info(`Event authQueue.resendActivateEmail received`);
      const token = this.appService.generateActivateToken(data.email);

      await this.mailerProducer.sendActivateEmail(
        new ActivateEmailEvent(data.email, data.name, token),
      );
    } catch (error) {
      this.handleError('authQueue.resendActivateEmail', error);
    }
  }

  @EventPattern('authQueue.generateRecoveryToken')
  async generateRecoveryToken(data: GenerateRecoveryTokenEvent) {
    try {
      this.loggerService.info(`Event authQueue.generateRecoveryToken received`);
      const token = this.appService.generateRecoveryToken(data);

      await this.recoveryRepository.upsert({
        where: { user_id: data.user_id },
        create: { user_id: data.user_id, jti_recovery_token: token.jwtJti },
        update: { jti_recovery_token: token.jwtJti },
      });
      await this.mailerProducer.sendRecoveryEmail(
        new RecoveryEmailEvent(data.email, data.name, token.recoveryToken),
      );
    } catch (error) {
      this.handleError('authQueue.generateRecoveryToken', error);
    }
  }

  private handleError(eventName: string, error: any) {
    const exception = {
      exception: error?.message,
      status: error?.response?.statusCode,
      stackTrace: extractStackTrace(error.stack),
    };
    this.loggerService.error(`[${eventName}] ${JSON.stringify(exception)}`);
    throw new HttpException(error.message, 500);
  }
}

export { AuthQueue };