import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { EmailUtil } from './email.util';
import { RandomUuidUtil } from './random-uuid.util';
import { ImagekitUtil } from './imagekit.util';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          secure: false,
          port: Number(configService.get('MAIL_PORT')),
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `Petik.com <${configService.get('MAIL_USER')}>`,
        },
        template: {
          dir: join(__dirname, '..', '..', 'views'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailUtil, RandomUuidUtil, ImagekitUtil],
  exports: [EmailUtil, RandomUuidUtil, ImagekitUtil],
})
export class UtilsModule {}
