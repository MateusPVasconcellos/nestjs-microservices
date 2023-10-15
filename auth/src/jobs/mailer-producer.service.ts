import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ActivateEmailEvent } from 'src/events/send-activate-email.event';
import { RecoveryEmailEvent } from 'src/events/send-recovery-email.event';
import { LoggerService } from 'src/shared/logger/logger.service';
@Injectable()
class MailerProducerService {
  constructor(@InjectQueue('mailerQueue') private mailerQueue: Queue, private readonly loggerService: LoggerService) {
    this.loggerService.contextName = MailerProducerService.name;
  }

  async sendActivateEmail(event: ActivateEmailEvent) {
    await this.mailerQueue.add('mailerQueue.sendActivateEmail', event)
    this.loggerService.info(`[mailerQueue.sendActivateEmail] ${JSON.stringify(event)}`
    );
  }

  async sendRecoveryEmail(event: RecoveryEmailEvent) {
    await this.mailerQueue.add('mailerQueue.sendRecoveryEmail', event);
    this.loggerService.info(`[mailerQueue.sendRecoveryEmail] ${JSON.stringify(event)}`)
  }
}

export { MailerProducerService };
