import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigType } from '@nestjs/config';
import mailConfig from './config/mail.config';
import { MailerQueue } from './queues/mailer-queue';
import { BullModule } from '@nestjs/bull';
import redisConfig from './config/redis.config';
import { LoggerModule } from './shared/logger/logger.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './shared/interceptor/loggin.interceptor';

@Module({
  imports: [
    LoggerModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [mailConfig] })],
      useFactory: (
        configMail: ConfigType<typeof mailConfig>,
      ): MailerOptions => ({
        transport: {
          host: configMail.host,
          port: configMail.port,
          auth: {
            user: configMail.auth.user,
            pass: configMail.auth.password,
          },
        },
      }),
      inject: [mailConfig.KEY],
    }),
    BullModule.registerQueue({
      name: 'mailerQueue',
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [redisConfig] })],
      useFactory: (configRedis: ConfigType<typeof redisConfig>) => ({
        redis: {
          port: configRedis.port,
          host: configRedis.host,
        },
      }),
      inject: [redisConfig.KEY],
    }),
  ],
  controllers: [MailerController],
  providers: [MailerService, MailerQueue, {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  }],
})
export class AppModule { }
