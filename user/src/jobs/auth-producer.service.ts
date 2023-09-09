import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { UserCreatedEvent } from 'src/events/user-created.event';

@Injectable()
class AuthProducerService {
  constructor(@InjectQueue('authQueue') private authQueue: Queue) {}

  async userCreated(event: UserCreatedEvent) {
    await this.authQueue.add('authQueue.userCreated', event);
  }

  async resendActivateEmail(event: UserCreatedEvent) {
    await this.authQueue.add('authQueue.resendActivateEmail', event);
  }
}

export { AuthProducerService };
