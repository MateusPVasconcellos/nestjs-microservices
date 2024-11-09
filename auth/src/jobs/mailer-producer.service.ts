import { Injectable, Inject } from '@nestjs/common';
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
    this.client.emit('mailerQueue.sendActivateEmail', event);
    this.loggerService.info(`[mailerQueue.sendActivateEmail] ${JSON.stringify(event)}`);
  }

  async sendRecoveryEmail(event: RecoveryEmailEvent) {
    this.client.emit('mailerQueue.sendRecoveryEmail', event);
    this.loggerService.info(`[mailerQueue.sendRecoveryEmail] ${JSON.stringify(event)}`);
  }
}

export { MailerProducerService };