import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ActivateEmailEvent } from 'src/events/send-activate-email.event';
import { RecoveryEmailEvent } from 'src/events/send-recovery-email.event';
@Injectable()
class MailerProducerService {
  constructor(@InjectQueue('mailerQueue') private mailerQueue: Queue) {}

  async sendActivateEmail(event: ActivateEmailEvent) {
    await this.mailerQueue.add('mailerQueue.sendActivateEmail', event);
  }

  async sendRecoveryEmail(event: RecoveryEmailEvent) {
    await this.mailerQueue.add('mailerQueue.sendRecoveryEmail', event);
  }
}

export { MailerProducerService };
