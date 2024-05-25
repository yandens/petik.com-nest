import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

export class EmailHelper {
  constructor(private mailService: MailerService) {}

  async sendEmail(user: User, subject: string, link: string) {
    await this.mailService.sendMail({
      to: user.email,
      subject,
      template: './verify-email',
      context: { link },
    });
  }
}
