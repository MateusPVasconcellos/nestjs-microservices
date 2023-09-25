import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { HttpException, Inject } from '@nestjs/common';
import { Job } from 'bull';
import { AppService } from 'src/app.service';
import { GenerateRecoveryTokenEvent } from 'src/events/generate-recovery-token.event';
import { ActivateEmailEvent } from 'src/events/send-activate-email.event';
import { RecoveryEmailEvent } from 'src/events/send-recovery-email.event';
import { UserCreatedEvent } from 'src/events/user-created.event';
import { MailerProducerService } from 'src/jobs/mailer-producer.service';
import {
  RECOVERY_REPOSITORY_TOKEN,
  RecoveryRepository,
} from 'src/repositories/interfaces/recovery.repository.interface';

@Processor('authQueue')
class AuthQueue {
  constructor(
    private readonly mailerProducer: MailerProducerService,
    @Inject(RECOVERY_REPOSITORY_TOKEN)
    private readonly recoveryRepository: RecoveryRepository,
    private readonly appService: AppService,
  ) {}

  @OnQueueFailed()
  handler(job: Job, error: Error) {
    console.log(`Fired Excption from ${job.name}:`, error);
    throw new HttpException(error.message, 401);
  }

  @Process('authQueue.userCreated')
  async generateActivateToken(job: Job<UserCreatedEvent>) {
    const { data } = job;
    const token = this.appService.generateActivateToken(data.email);

    await this.mailerProducer.sendActivateEmail(
      new ActivateEmailEvent(data.email, data.name, token),
    );
  }

  @Process('authQueue.resendActivateEmail')
  async regenerateActivateToken(job: Job<UserCreatedEvent>) {
    const { data } = job;
    const token = this.appService.generateActivateToken(data.email);

    await this.mailerProducer.sendActivateEmail(
      new ActivateEmailEvent(data.email, data.name, token),
    );
  }

  @Process('authQueue.generateRecoveryToken')
  async generateRecoveryToken(job: Job<GenerateRecoveryTokenEvent>) {
    const { data } = job;
    const token = this.appService.generateRecoveryToken(data);

    await this.recoveryRepository.upsert({
      where: { user_id: data.user_id },
      create: { user_id: data.user_id, jti_recovery_token: token.jwtJti },
      update: { jti_recovery_token: token.jwtJti },
    });
    await this.mailerProducer.sendRecoveryEmail(
      new RecoveryEmailEvent(data.email, data.name, token.recoveryToken),
    );
  }
}

export { AuthQueue };
