import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mailConfig from './config/mail.config';
import { MailerQueue } from './queues/mailer-queue';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from './shared/logger/logger.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './shared/interceptor/loggin.interceptor';
import rmqConfig from './config/rmq.config';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mailConfig, rmqConfig],
    }),
    ClientsModule.registerAsync([
      {
        name: 'MAILER_QUEUE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://user:password@localhost:5672'],
            queue: 'mailerQueue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<MailerOptions> => ({
        transport: {
          host: configService.get<string>('mail.host'),
          port: configService.get<number>('mail.port'),
          auth: {
            user: configService.get<number>('mail.auth.user'),
            pass: configService.get<number>('mail.auth.password'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailerController, MailerQueue],
  providers: [
    MailerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}