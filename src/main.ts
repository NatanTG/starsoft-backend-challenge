import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { env } from './core/env';
import {
  createSwaggerConfig,
  swaggerDocumentOptions,
  swaggerCustomOptions,
} from './core/config/swagger.config';
import { configureHelmet, configureCors } from './core/config/security.config';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { MyLogger } from './shared/services/logger/structured-logger.service';
import { MetricsService } from './shared/services/metrics/metrics.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(MyLogger));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const metricsService = app.get(MetricsService);
  const logger = app.get(MyLogger);
  app.useGlobalInterceptors(new LoggingInterceptor(metricsService, logger));

  const swaggerConfig = createSwaggerConfig();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig, swaggerDocumentOptions);
  SwaggerModule.setup('api', app, documentFactory, swaggerCustomOptions);

  configureHelmet(app);
  configureCors(app);

  await app.listen(env.PORT);
}

void bootstrap();
