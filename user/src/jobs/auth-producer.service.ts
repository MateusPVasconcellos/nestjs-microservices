import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GenerateRecoveryTokenEvent } from 'src/events/generate-recovery-token.event';
import { UserCreatedEvent } from 'src/events/user-created.event';
import { LoggerService } from 'src/shared/logger/logger.service';

@Injectable()
class AuthProducerService {
  constructor(
    @Inject('AUTH_QUEUE') private readonly authQueueClient: ClientProxy,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.contextName = AuthProducerService.name;
  }

  async userCreated(event: UserCreatedEvent) {
    this.authQueueClient.emit('authQueue.userCreated', event);
    this.loggerService.info(`[authQueue.userCreated] ${JSON.stringify(event)}`);
  }

  async resendActivateEmail(event: UserCreatedEvent) {
    this.authQueueClient.emit('authQueue.resendActivateEmail', event);
    this.loggerService.info(`[authQueue.resendActivateEmail] ${JSON.stringify(event)}`);
  }

  async generateRecoveryToken(event: GenerateRecoveryTokenEvent) {
    this.authQueueClient.emit('authQueue.generateRecoveryToken', event);
    this.loggerService.info(`[authQueue.generateRecoveryToken] ${JSON.stringify(event)}`);
  }
}

export { AuthProducerService };