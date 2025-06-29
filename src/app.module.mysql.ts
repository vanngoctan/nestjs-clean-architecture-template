import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MysqlDatabaseModule } from "./infrastructure/database/mysql/mysql-database.module";
import { MetricsModule } from "./infrastructure/metrics/metrics.module";
import { QueuesModule } from "./infrastructure/queues/queues.module";
import { CacheModule } from "./infrastructure/cache/cache.module";
import { FeatureFlagModule } from "./infrastructure/feature-flags/feature-flag.module";
import { HealthModule } from "./presentation/modules/health/health.module";
import { UserModule } from "./presentation/modules/user/user.module.mysql";

/**
 * Root module of the application using MySQL database
 */
@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database module
    MysqlDatabaseModule,

    // Feature modules
    UserModule,

    // Queue system
    QueuesModule,

    // Cache system
    CacheModule,

    // Feature flag system
    FeatureFlagModule,
  ],
})
export class AppModule {}
