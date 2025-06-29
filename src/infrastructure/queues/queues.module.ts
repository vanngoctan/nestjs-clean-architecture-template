import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Module that provides the queue infrastructure using BullMQ.
 * This sets up a centralized connection to Redis for all queues.
 */
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          connection: {
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
            password: configService.get<string>('REDIS_PASSWORD', ''),
            db: configService.get<number>('REDIS_DB', 0),
          },
          defaultJobOptions: {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 1000,
            },
            removeOnComplete: 100, // Keep the last 100 completed jobs
            removeOnFail: 200, // Keep the last 200 failed jobs
          },
        };
      },
    }),
  ],
  exports: [BullModule],
})
export class QueuesModule {}
