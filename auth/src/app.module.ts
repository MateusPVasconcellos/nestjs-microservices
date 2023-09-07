import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import mailConfig from './config/mail.config';
import { JwtService } from './services/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import { provideAuthRepository } from './repositories/auth.repository.provider';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthQueue } from './queues/auth-queue';
import { MailerProducerService } from './jobs/mailer-producer.service';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot({ load: [jwtConfig], isGlobal: true }),
    BullModule.registerQueue({
      name: 'authQueue',
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    JwtRefreshStrategy,
    JwtService,
    AuthQueue,
    MailerProducerService,
    ...provideAuthRepository(),
  ],
})
export class AppModule {}
