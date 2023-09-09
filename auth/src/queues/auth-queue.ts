import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { HttpException } from '@nestjs/common';
import { Job } from 'bull';
import { ActivateEmailEvent } from 'src/events/send-activate-email.event';
import { RecoveryEmailEvent } from 'src/events/send-recovery-email.event';
import { UserCreatedEvent } from 'src/events/user-created.event';
import { MailerProducerService } from 'src/jobs/mailer-producer.service';
import { JwtService } from 'src/services/jwt.service';

@Processor('authQueue')
class AuthQueue {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerProducer: MailerProducerService,
  ) {}

  @OnQueueFailed()
  handler(job: Job, error: Error) {
    console.log(`Fired Excption from ${job.name}:`, error);
    throw new HttpException(error.message, 401);
  }

  @Process('authQueue.userCreated')
  async generateActivateToken(job: Job<UserCreatedEvent>) {
    const { data } = job;
    const token = this.jwtService.generateActivateToken(data.email);

    await this.mailerProducer.sendActivateEmail(
      new ActivateEmailEvent(data.email, data.name, token),
    );
  }

  @Process('authQueue.resendActivateEmail')
  async regenerateActivateToken(job: Job<UserCreatedEvent>) {
    const { data } = job;
    const token = this.jwtService.generateActivateToken(data.email);

    await this.mailerProducer.sendActivateEmail(
      new ActivateEmailEvent(data.email, data.name, token),
    );
  }

  @Process('authQueue.sendRecoveryEmail')
  async sendRecoveryEmailJob(job: Job<RecoveryEmailEvent>) {
    const { data } = job;
  }
}

export { AuthQueue };
