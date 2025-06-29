import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import * as Joi from 'joi';
import { MysqlDatabaseModule } from './infrastructure/database/mysql/mysql-database.module';
import { MongoDatabaseModule } from './infrastructure/database/mongodb/mongodb-database.module';
import { MetricsModule } from './infrastructure/metrics/metrics.module';
import { QueuesModule } from './infrastructure/queues/queues.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { FeatureFlagModule } from './infrastructure/feature-flags/feature-flag.module';
import { HealthModule } from './presentation/modules/health/health.module';
import { UserModule as MySqlUserModule } from './presentation/modules/user/user.module.mysql';
import { UserModule as MongoUserModule } from './presentation/modules/user/user.module.mongodb';

/**
 * Root module of the application with database selection based on environment variable
 */
@Module({
  imports: [
    // Logger module for structured logging
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            level: isProduction ? 'info' : 'debug',
            transport: isProduction
              ? undefined // Use default JSON transport in production
              : { target: 'pino-pretty' }, // Use pretty format in development
            genReqId: () => randomUUID(), // Generate unique request ID
            autoLogging: true,
            formatters: {
              level: (label) => ({ level: label }),
            },
            redact: {
              paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'req.headers["set-cookie"]',
                '*.password',
                '*.passwordHash',
              ],
              censor: '***REDACTED***',
            },
          },
        };
      },
    }),

    // Configuration module with validation schema
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_TYPE: Joi.string().valid('mysql', 'mongodb').required(),
        // MySQL config
        MYSQL_HOST: Joi.string().when('DATABASE_TYPE', {
          is: 'mysql',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        MYSQL_PORT: Joi.number().when('DATABASE_TYPE', {
          is: 'mysql',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        MYSQL_USER: Joi.string().when('DATABASE_TYPE', {
          is: 'mysql',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        MYSQL_PASSWORD: Joi.string().when('DATABASE_TYPE', {
          is: 'mysql',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        MYSQL_DATABASE: Joi.string().when('DATABASE_TYPE', {
          is: 'mysql',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        // MongoDB config
        MONGODB_URI: Joi.string().when('DATABASE_TYPE', {
          is: 'mongodb',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        // Redis config for queues and cache
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().allow('').default(''),
        REDIS_DB: Joi.number().default(0),
        // Security
        CORS_ORIGIN: Joi.string().default('https://your-frontend-domain.com'),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per IP
      },
    ]),

    // Metrics for monitoring
    MetricsModule,

    // Health checks
    HealthModule,

    // Queue system
    QueuesModule,

    // Cache system
    CacheModule,

    // Feature flag system
    FeatureFlagModule,

    // Dynamically import database modules based on configuration
    MysqlDatabaseModule,
    MongoDatabaseModule,

    // Import both user modules and let the repository provider in each module
    // determine which implementation to use based on the DATABASE_TYPE env var
    MySqlUserModule,
    MongoUserModule,
  ],
  providers: [
    // Register ThrottlerGuard as a global guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
