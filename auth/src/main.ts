import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { PrismaService } from './database/prisma.service';
import { AllExceptionsFilter } from './shared/filters/exception.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  app.enableCors({ origin: '*', allowedHeaders: '*', methods: '*' });

  await app.startAllMicroservices();
  await app.listen(8000);
}
bootstrap();
