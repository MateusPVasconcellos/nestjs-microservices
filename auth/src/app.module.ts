import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import mailConfig from './config/mail.config';
import { AuthQueue } from './queues/auth-queue';
import { JwtService } from './services/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import { provideAuthRepository } from './repositories/auth.repository.provider';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot({ load: [jwtConfig], isGlobal: true }),
    BullModule.registerQueue({
      name: 'authQueue',
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
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: new ConfigService().get('redis.host'),
          port: new ConfigService().get('redis.port'),
        },
      },
    ]),
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    AuthQueue,
    JwtService,
    ...provideAuthRepository(),
  ],
})
export class AppModule {}
