import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module'; // Unified module that supports both databases
import { GlobalExceptionFilter } from './presentation/shared/filters/global-exception.filter';

async function bootstrap() {
  // Create application with buffer logs enabled until logger is initialized
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Use the Pino logger instead of the default NestJS logger
  app.useLogger(app.get(Logger));

  // Apply security middlewares
  app.use(helmet);
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'https://your-frontend-domain.com',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable graceful shutdown
  app.enableShutdownHooks();

  // Set global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
      transform: true, // Transform payloads to be objects typed according to their DTO classes
    }),
  );

  // Apply global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('NestJS Clean Architecture API')
    .setDescription(
      'A production-ready NestJS API template following Clean Architecture principles',
    )
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the application
  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Get logger instance
  const logger = app.get(Logger);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
