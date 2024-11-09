import { MailerService } from '@nestjs-modules/mailer';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ActivateEmailEvent } from 'src/events/send-activate-email.event';
import { RecoveryEmailEvent } from 'src/events/send-recovery-email.event';

@Controller()
class MailerQueue {
  constructor(private readonly mailService: MailerService) {}

  @EventPattern('mailerQueue.sendActivateEmail')
  async handleSendActivateEmail(data: ActivateEmailEvent) {
    try {
      await this.mailService.sendMail({
        to: data.email,
        from: 'Team G',
        subject: 'Welcome!',
        text: `Your registration was successful, click the link to activate your account: ${data.token}`,
      });
    } catch (error) {
      this.handleError('mailerQueue.sendActivateEmail', error);
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
    } catch (error) {
      this.handleError('mailerQueue.sendRecoveryEmail', error);
    }
  }

  private handleError(context: string, error: Error) {
    console.error(`Error in ${context}:`, error.message);
    // Aqui você pode implementar lógica adicional de tratamento de erro, como reenvio ou logging
    throw new Error(`Failed to process ${context}: ${error.message}`);
  }
}

export { MailerQueue };