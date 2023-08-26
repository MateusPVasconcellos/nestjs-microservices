import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { RecoveryEmailEvent } from 'src/events/send-recovery-email.event';
import { UserCreatedEvent } from 'src/events/user-created.event';

@Injectable()
class UserProducerService {
  constructor(@InjectQueue('authQueue') private queue: Queue) {}

  async sendActivateEmail(userCreatedEvent: UserCreatedEvent) {
    await this.queue.add('authQueue.sendActivateEmail', userCreatedEvent);
  }

  async sendRecoveryEmail(recoveryEmailEvent: RecoveryEmailEvent) {
    await this.queue.add('authQueue.sendRecoveryEmail', recoveryEmailEvent);
  }
}

export { UserProducerService };
