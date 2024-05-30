import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailHelper {
  constructor(private mailService: MailerService) {}

  async sendEmail(user: User, subject: string, template: string, link: string) {
    await this.mailService.sendMail({
      to: user.email,
      subject,
      template,
      context: { link },
    });
  }
}
