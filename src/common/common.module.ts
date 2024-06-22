import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './service/prisma.service';
import { ValidationService } from './service/validation.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './filter/error.filter';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './middleware/auth.middleware';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1d' },
        global: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [PrismaService, ValidationService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
