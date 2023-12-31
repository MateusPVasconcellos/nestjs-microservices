import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { GenerateRecoveryTokenEvent } from 'src/events/generate-recovery-token.event';
import { UserCreatedEvent } from 'src/events/user-created.event';
import { LoggerService } from 'src/shared/logger/logger.service';

@Injectable()
class AuthProducerService {
  constructor(@InjectQueue('authQueue') private authQueue: Queue, private readonly loggerService: LoggerService) {
    this.loggerService.contextName = AuthProducerService.name;
  }

  async userCreated(event: UserCreatedEvent) {
    await this.authQueue.add('authQueue.userCreated', event);
    this.loggerService.info(`[authQueue.userCreated] ${JSON.stringify(event)}`)
  }

  async resendActivateEmail(event: UserCreatedEvent) {
    await this.authQueue.add('authQueue.resendActivateEmail', event);
    this.loggerService.info(`[authQueue.resendActivateEmail] ${JSON.stringify(event)}`)
  }

  async generateRecoveryToken(event: GenerateRecoveryTokenEvent) {
    await this.authQueue.add('authQueue.generateRecoveryToken', event);
    this.loggerService.info(`[authQueue.generateRecoveryToken] ${JSON.stringify(event)}`)
  }
}

export { AuthProducerService };
