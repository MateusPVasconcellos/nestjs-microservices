import { NestFactory } from '@nestjs/core';
import { AppModule } from './mailer.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'mailerQueue',
      queueOptions: {
        durable: true,
      },
    },
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({ origin: '*', allowedHeaders: '*', methods: '*' });
  await app.startAllMicroservices();
  await app.listen(8020);
}
bootstrap();
