import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { PrismaService } from './database/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { provideUsersRepository } from './repositories/user.repository.provider';
import { AuthProducerService } from './jobs/auth-producer.service';
import { LocalStrategy } from './strategies/local.strategy';
import { LoggerModule } from './shared/logger/logger.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './shared/interceptors/loggin.interceptor';
import rmqConfig from './config/rmq.config'; // Certifique-se de importar corretamente
import tcpConfig from './config/tcp.config';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rmqConfig, tcpConfig],
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('tcp.authServiceHost'),
            port: configService.get<number>('tcp.authServicePort'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'AUTH_QUEUE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rmq.url')],
            queue: 'authQueue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    UsersService,
    PrismaService,
    ...provideUsersRepository(),
    AuthProducerService,
    LocalStrategy,
  ],
  exports: [AuthProducerService],
})
export class UserModule {}