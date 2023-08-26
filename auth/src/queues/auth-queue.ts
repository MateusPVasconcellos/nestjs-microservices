import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { HttpException } from '@nestjs/common';
import { Job } from 'bull';
import { UserCreatedEvent } from '../events/user-created.event';
import { RecoveryEmailEvent } from 'src/events/send-recovery-email.event';
import { JwtService } from 'src/services/jwt.service';

@Processor('authQueue')
class AuthQueue {
  constructor(
    private readonly mailService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  @OnQueueFailed()
  handler(job: Job, error: Error) {
    console.log(`Fired Excption from ${job.name}:`, error);
    throw new HttpException(error.message, 401);
  }

  @Process('authQueue.sendActivateEmail')
  async sendActivateMailJob(job: Job<UserCreatedEvent>) {
    const { data } = job;
    const token = this.jwtService.generateActivateToken(data.email);

    await this.mailService.sendMail({
      to: data.email,
      from: 'Team G',
      subject: 'Welcome!',
      text:
        'Your registration was successful, click in the link to activate your account.' +
        token,
    });
  }

  @Process('authQueue.sendRecoveryEmail')
  async sendRecoveryEmailJob(job: Job<RecoveryEmailEvent>) {
    const { data } = job;
    const token = this.jwtService.generateRecoveryToken(
      'teste123456',
      data.email,
    );
    await this.mailService.sendMail({
      to: data.email,
      from: 'Team G',
      subject: 'Welcome!',
      text: 'Follow the link to reset your password' + token,
    });
  }
}

export { AuthQueue };
