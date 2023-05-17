import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from 'src/app.module';
import { HttpExceptionFilter } from 'src/common/filters/http.filter';
import { UncaughtExceptionFilter } from 'src/common/filters/uncaught.filter';
import { CustomWinstonLogger } from 'src/logger/custom_winston_logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // nginx controls cors for us
  app.enableCors();
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  const logger = await app.resolve<CustomWinstonLogger>(CustomWinstonLogger);
  // Filters are checked in reverse order, so the last filter
  // used in the argument list is checked first
  app.useGlobalFilters(
    new UncaughtExceptionFilter(logger),
    new HttpExceptionFilter(),
  );

  logger.log(`running on port ${process.env.PORT}`);
  await app.listen(process.env.PORT || -1);
}
bootstrap();
