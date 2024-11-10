import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Controller, InternalServerErrorException } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ActivateEmailEvent } from 'src/events/send-activate-email.event';
import { RecoveryEmailEvent } from 'src/events/send-recovery-email.event';
import { LoggerService } from 'src/shared/logger/logger.service';

@Controller()
class MailerQueue {
  constructor(
    private readonly mailService: MailerService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.contextName = MailerQueue.name;
  }

  @EventPattern('mailerQueue.sendActivateEmail')
  async handleSendActivateEmail(data: ActivateEmailEvent) {
    try {
      await this.mailService.sendMail({
        to: data.email,
        from: 'Team G',
        subject: 'Welcome!',
        text: `Your registration was successful, click the link to activate your account: ${data.token}`,
      });
      this.loggerService.info(`Activation email sent to: ${data.email}`);
    } catch (error) {
      error.context = MailerQueue.name;
      throw new InternalServerErrorException(error, 'Failed to send activation email');
    }
  }

  @EventPattern('mailerQueue.sendRecoveryEmail')
  async handleSendRecoveryEmail(data: RecoveryEmailEvent) {
    try {
      await this.mailService.sendMail({
        to: data.email,
        from: 'Team G',
        subject: 'Reset your password',
        text: `Follow the link to reset your password: ${data.token}`,
      });
      this.loggerService.info(`Recovery email sent to: ${data.email}`);
    } catch (error) {
      error.context = MailerQueue.name;
      throw new InternalServerErrorException(error, 'Failed to send recovery email');
    }
  }
}

export { MailerQueue };