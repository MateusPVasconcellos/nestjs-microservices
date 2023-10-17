import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { PrismaService } from './database/prisma.service';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigType } from '@nestjs/config';
import redisConfig from './config/redis.config';
import { provideEventRepository } from './repositories/event.repository.provider';

@Module({
  imports: [BullModule.forRootAsync({
    imports: [ConfigModule.forRoot({ load: [redisConfig] })],
    useFactory: (configRedis: ConfigType<typeof redisConfig>) => ({
      redis: {
        port: configRedis.port,
        host: configRedis.host,
      },
    }),
    inject: [redisConfig.KEY],
  }),],
  controllers: [EventController],
  providers: [EventService, PrismaService, ...provideEventRepository()],
})
export class EventModule { }
