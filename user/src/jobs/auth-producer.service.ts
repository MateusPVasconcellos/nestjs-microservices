import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { UserCreatedEvent } from 'src/events/user-created.event';

@Injectable()
class AuthProducerService {
  constructor(@InjectQueue('authQueue') private authQueue: Queue) {}

  async userCreated(userCreatedEvent: UserCreatedEvent) {
    await this.authQueue.add('authQueue.userCreated', userCreatedEvent);
  }
}

export { AuthProducerService };
