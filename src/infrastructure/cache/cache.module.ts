import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheModule as NestCacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-yet";

/**
 * Module that configures Redis caching throughout the application.
 */
@Module({
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const ttl = configService.get<number>("CACHE_TTL", 60) * 1000; // in milliseconds
        return {
          store: await redisStore({
            socket: {
              host: configService.get<string>("REDIS_HOST", "localhost"),
              port: configService.get<number>("REDIS_PORT", 6379),
            },
            password: configService.get<string>("REDIS_PASSWORD", ""),
            database: configService.get<number>("REDIS_CACHE_DB", 1), // Use a different DB than queue
            ttl,
          }),
          ttl,
        };
      },
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}
