import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

// ─── Production environment validation ───────────────────────────────────────
// SEC-03 / SEC-04: Validate critical env vars at startup before the app binds
// to any port. Crashes with a clear message rather than running misconfigured.
function validateProductionEnvironment() {
  const logger = new Logger('StartupValidation');
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    logger.warn(
      'NODE_ENV is not "production" — skipping strict env validation. ' +
      'Never run without full environment validation in production.',
    );
    return;
  }

  const errors: string[] = [];

  // JWT secret is mandatory and must not be a placeholder
  const jwtSecret = process.env.JWT_SECRET;
  const knownInsecureJwtSecrets = [
    'dhara_dev_jwt_secret_change_in_production_si2026',
    'bhumitra_dev_jwt_secret_change_in_production_si2026',
    'REPLACE_WITH_CRYPTOGRAPHICALLY_RANDOM_64_CHAR_SECRET',
    'change_me',
    'changeme',
    'secret',
  ];
  if (!jwtSecret) {
    errors.push('JWT_SECRET is not set');
  } else if (knownInsecureJwtSecrets.includes(jwtSecret.trim())) {
    errors.push('JWT_SECRET is set to a known insecure placeholder. Generate a cryptographically random value.');
  } else if (jwtSecret.length < 32) {
    errors.push('JWT_SECRET is too short — minimum 32 characters required, 64+ recommended.');
  }

  // DATABASE_URL is mandatory in production
  if (!process.env.DATABASE_URL) {
    errors.push('DATABASE_URL is not set');
  } else if (process.env.DATABASE_URL.includes('127.0.0.1:54329')) {
    // SEC-04: Reject the embedded-PG URL in production
    errors.push(
      'DATABASE_URL points to the embedded local PostgreSQL instance (port 54329). ' +
      'This is not a production database. Set DATABASE_URL to a real PostgreSQL server.',
    );
  }

  // CORS origins must be explicitly configured
  if (!process.env.CORS_ORIGINS) {
    errors.push('CORS_ORIGINS is not set — API will only accept requests from localhost');
  }

  if (errors.length > 0) {
    logger.error('=== FATAL STARTUP VALIDATION FAILURES ===');
    errors.forEach((e) => logger.error(`  ✗ ${e}`));
    logger.error('===========================================');
    process.exit(1);
  }

  logger.log('Production environment validation passed.');
}

async function bootstrap() {
  // Validate before anything else runs
  validateProductionEnvironment();

  const logger = new Logger('DharaBootstrap');
  const app = await NestFactory.create(AppModule);

  // SEC-09: Register global exception filter — suppresses stack traces on 500 errors,
  // returns structured JSON responses, prevents internal path/detail leakage.
  app.useGlobalFilters(new HttpExceptionFilter());

  // Security Headers via Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
  }));

  // CORS configuration
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global prefix for versioned API
  app.setGlobalPrefix('api/v1');

  // SEC-07: Global input validation.
  // Note: DTOs are plain TypeScript interfaces (import type) in @bhumitra/types,
  // so class-validator decorators cannot be applied to them directly.
  // This pipe strips unknown properties and enforces transformation on what
  // metadata exists. Full DTO validation requires migrating DTOs to decorated classes.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // Cannot enforce yet — DTOs are interfaces
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('DHARA API')
    .setDescription(
      'DHARA — Digital Hub for Acquisition, Rehabilitation & Administration — ' +
      'National Land Acquisition Intelligence & Management Platform API — Government of India',
    )
    .setVersion('1.0.0-sih')
    .addTag('Health', 'Service health check endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your Bearer token',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'DHARA API Docs',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`========================================================`);
  logger.log(`  DHARA — Digital Hub for Acquisition, Rehabilitation & Administration`);
  logger.log(`  National Land Acquisition Management API`);
  logger.log(`  Running on: http://localhost:${port}/api/v1`);
  logger.log(`  Swagger UI: http://localhost:${port}/api/docs`);
  logger.log(`  Health Check: http://localhost:${port}/api/v1/health`);
  logger.log(`========================================================`);
}

bootstrap();
