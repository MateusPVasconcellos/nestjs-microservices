import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from './database/prisma.service';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
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

@Module({
  imports: [
    LoggerModule,
    JwtModule.register({}),
    ConfigModule.forRoot({ load: [jwtConfig], isGlobal: true }),
    ClientsModule.register([
      {
        name: 'AUTH_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: 'authQueue', 
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'MAILER_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: 'mailerQueue', 
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    AuthQueue,
    MailerProducerService,
    ...provideRefreshRepository(),
    ...provideRecoveryRepository(),
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AuthModule { }
