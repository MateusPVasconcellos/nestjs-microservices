import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import redisConfig from './config/redis.config';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
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
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
