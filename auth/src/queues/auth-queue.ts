import { Controller, HttpException, InternalServerErrorException, Inject } from '@nestjs/common';
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
    this.loggerService.info(`Event authQueue.userCreated received for email: ${data.email}`);
    try {
      const token = this.appService.generateActivateToken(data.email);
      await this.mailerProducer.sendActivateEmail(
        new ActivateEmailEvent(data.email, data.name, token),
      );
      this.loggerService.info(`Activation email sent to: ${data.email}`);
    } catch (error) {
      error.context = AuthQueue.name;
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error, 'Failed to generate activation token');
    }
  }

  @EventPattern('authQueue.resendActivateEmail')
  async regenerateActivateToken(data: UserCreatedEvent) {
    this.loggerService.info(`Event authQueue.resendActivateEmail received for email: ${data.email}`);
    try {
      const token = this.appService.generateActivateToken(data.email);
      await this.mailerProducer.sendActivateEmail(
        new ActivateEmailEvent(data.email, data.name, token),
      );
      this.loggerService.info(`Activation email resent to: ${data.email}`);
    } catch (error) {
      error.context = AuthQueue.name;
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error, 'Failed to regenerate activation token');
    }
  }

  @EventPattern('authQueue.generateRecoveryToken')
  async generateRecoveryToken(data: GenerateRecoveryTokenEvent) {
    this.loggerService.info(`Event authQueue.generateRecoveryToken received for user: ${data.user_id}`);
    try {
      const token = this.appService.generateRecoveryToken(data);
      await this.recoveryRepository.upsert({
        where: { user_id: data.user_id },
        create: { user_id: data.user_id, jti_recovery_token: token.jwtJti },
        update: { jti_recovery_token: token.jwtJti },
      });
      await this.mailerProducer.sendRecoveryEmail(
        new RecoveryEmailEvent(data.email, data.name, token.recoveryToken),
      );
      this.loggerService.info(`Recovery email sent to: ${data.email}`);
    } catch (error) {
      error.context = AuthQueue.name;
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error, 'Failed to generate recovery token');
    }
  }
}

export { AuthQueue };