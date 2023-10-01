import { Module } from '@nestjs/common';
import { UsersController } from './app.controller';
import { UsersService } from './app.service';
import { PrismaService } from './database/prisma.service';
import redisConfig from './config/redis.config';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { provideUsersRepository } from './repositories/user.repository.provider';
import { AuthProducerService } from './jobs/auth-producer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
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
        name: 'AUTH_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: new ConfigService().get('redis.host'),
          port: new ConfigService().get('redis.port'),
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    ...provideUsersRepository(),
    AuthProducerService,
    LocalStrategy,
  ],
  exports: [AuthProducerService],
})
export class AppModule { }
