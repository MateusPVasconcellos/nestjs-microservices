import { NestFactory } from '@nestjs/core';
import { AppModule } from './mailer.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({ origin: '*', allowedHeaders: '*', methods: '*' });
  await app.listen(8020);
}
bootstrap();
