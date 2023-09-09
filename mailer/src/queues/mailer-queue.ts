import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { HttpException } from '@nestjs/common';
import { Job } from 'bull';
import { ActivateEmailEvent } from 'src/events/send-activate-email.event';
import { RecoveryEmailEvent } from 'src/events/send-recovery-email.event';

@Processor('mailerQueue')
class MailerQueue {
  constructor(private readonly mailService: MailerService) {}

  @OnQueueFailed()
  handler(job: Job, error: Error) {
    console.log(`Fired Excption from ${job.name}:`, error);
    throw new HttpException(error.message, 401);
  }

  @Process('mailerQueue.sendActivateEmail')
  async sendActivateEmail(job: Job<ActivateEmailEvent>) {
    const { data } = job;
    await this.mailService.sendMail({
      to: data.email,
      from: 'Team G',
      subject: 'Welcome!',
      text:
        'Your registration was successful, click in the link to activate your account.' +
        data.token,
    });
  }

  @Process('mailerQueue.sendRecoveryEmail')
  async sendRecoveryEmailJob(job: Job<RecoveryEmailEvent>) {
    const { data } = job;
    console.log(data);
    await this.mailService.sendMail({
      to: data.email,
      from: 'Team G',
      subject: 'Reset your password',
      text: 'Follow the link to reset your password' + data.token,
    });
  }
}
export { MailerQueue };
