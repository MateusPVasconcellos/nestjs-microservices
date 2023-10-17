import { NestFactory } from "@nestjs/core";
import { EventModule } from "./event.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from "./shared/filters/exception.filter";
import { PrismaService } from "./database/prisma.service";

async function bootstrap() {
  const app = await NestFactory.create(EventModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  app.enableCors({ origin: '*', allowedHeaders: '*', methods: '*' });

  await app.startAllMicroservices();
  await app.listen(8030);
}
bootstrap();