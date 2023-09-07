import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ActivateEmailEvent } from 'src/events/send-activate-email.event';
@Injectable()
class MailerProducerService {
  constructor(@InjectQueue('mailerQueue') private mailerQueue: Queue) {}

  async sendActivateEmail(activateEmailEvent: ActivateEmailEvent) {
    await this.mailerQueue.add(
      'mailerQueue.sendActivateEmail',
      activateEmailEvent,
    );
  }
}

export { MailerProducerService };
