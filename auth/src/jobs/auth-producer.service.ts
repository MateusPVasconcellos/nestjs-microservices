import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { UserCreatedEvent } from '../events/user-created.event';
import { RecoveryEmailEvent } from '../events/send-recovery-email.event';

@Injectable()
class AuthProducerService {
  constructor(@InjectQueue('authQueue') private queue: Queue) {}

  async sendActivateEmail(userCreatedEvent: UserCreatedEvent) {
    await this.queue.add('authQueue.sendActivateEmail', userCreatedEvent);
  }

  async sendRecoveryEmail(recoveryEmailEvent: RecoveryEmailEvent) {
    await this.queue.add('authQueue.sendRecoveryEmail', recoveryEmailEvent);
  }
}

export { AuthProducerService };
