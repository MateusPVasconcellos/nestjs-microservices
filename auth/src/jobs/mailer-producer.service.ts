import { Injectable, Inject, InternalServerErrorException, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ActivateEmailEvent } from 'src/events/send-activate-email.event';
import { RecoveryEmailEvent } from 'src/events/send-recovery-email.event';
import { LoggerService } from 'src/shared/logger/logger.service';

@Injectable()
class MailerProducerService {
  constructor(
    @Inject('MAILER_QUEUE') private readonly client: ClientProxy,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.contextName = MailerProducerService.name;
  }

  async sendActivateEmail(event: ActivateEmailEvent) {
    try {
      this.client.emit('mailerQueue.sendActivateEmail', event);
      this.loggerService.info(`[mailerQueue.sendActivateEmail] ${JSON.stringify(event)}`);
    } catch (error) {
      error.context = MailerProducerService.name;
      throw new InternalServerErrorException(error, 'Failed to send activation email');
    }
  }

  async sendRecoveryEmail(event: RecoveryEmailEvent) {
    try {
      this.client.emit('mailerQueue.sendRecoveryEmail', event);
      this.loggerService.info(`[mailerQueue.sendRecoveryEmail] ${JSON.stringify(event)}`);
    } catch (error) {
      error.context = MailerProducerService.name;
      throw new InternalServerErrorException(error, 'Failed to send recovery email');
    }
  }
}

export { MailerProducerService };