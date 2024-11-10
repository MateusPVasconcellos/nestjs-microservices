import { Injectable, Inject, InternalServerErrorException, HttpException } from '@nestjs/common';
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
    try {
      this.authQueueClient.emit('authQueue.userCreated', event);
      this.loggerService.info(`[authQueue.userCreated] ${JSON.stringify(event)}`);
    } catch (error) {
      error.context = AuthProducerService.name;
      throw new InternalServerErrorException(error, 'Failed to emit userCreated event');
    }
  }

  async resendActivateEmail(event: UserCreatedEvent) {
    try {
      this.authQueueClient.emit('authQueue.resendActivateEmail', event);
      this.loggerService.info(`[authQueue.resendActivateEmail] ${JSON.stringify(event)}`);
    } catch (error) {
      error.context = AuthProducerService.name;
      throw new InternalServerErrorException(error, 'Failed to emit resendActivateEmail event');
    }
  }

  async generateRecoveryToken(event: GenerateRecoveryTokenEvent) {
    try {
      this.authQueueClient.emit('authQueue.generateRecoveryToken', event);
      this.loggerService.info(`[authQueue.generateRecoveryToken] ${JSON.stringify(event)}`);
    } catch (error) {
      error.context = AuthProducerService.name;
      throw new InternalServerErrorException(error, 'Failed to emit generateRecoveryToken event');
    }
  }
}

export { AuthProducerService };