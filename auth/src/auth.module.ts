import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from './database/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MailerProducerService } from './jobs/mailer-producer.service';
import { provideRefreshRepository } from './repositories/providers/refresh.repository.provider';
import { provideRecoveryRepository } from './repositories/providers/recovery.repository.provider';
import { LoggerModule } from './shared/logger/logger.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './shared/interceptors/loggin.interceptor';
import { AuthQueue } from './queues/auth-queue';
import rmqConfig from './config/rmq.config';
import tcpConfig from './config/tcp.config';

@Module({
  imports: [
    LoggerModule,
    JwtModule.register({}),
    ConfigModule.forRoot({ load: [jwtConfig, rmqConfig, tcpConfig], isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_QUEUE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://user:password@localhost:5672'],
            queue: 'authQueue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
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
      {
        name: 'USER_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('tcp.authServiceHost'),
            port: configService.get<number>('tcp.authServicePort'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController, AuthQueue],
  providers: [
    AuthService,
    PrismaService,
    MailerProducerService,
    ...provideRefreshRepository(),
    ...provideRecoveryRepository(),
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AuthModule {}