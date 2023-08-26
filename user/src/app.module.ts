import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import redisConfig from './config/redis.config';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { provideUsersRepository } from './repositories/user.repository.provider';
import { UserProducerService } from './jobs/user-producer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    ...provideUsersRepository(),
    UserProducerService,
  ],
  exports: [UserProducerService],
})
export class AppModule {}
