import { Module } from '@nestjs/common';
import {
  PrometheusModule,
  makeCounterProvider,
} from '@willsoto/nestjs-prometheus';
import { MetricsController } from './metrics.controller';
import { UserMetrics } from './counters/user-metrics';

/**
 * Module that provides Prometheus metrics collection and exposure.
 */
@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
        config: {
          prefix: 'nestjs_clean_arch_',
        },
      },
      // Path is set in controller instead of here to allow for better security
    }),
  ],
  controllers: [MetricsController],
  providers: [
    makeCounterProvider({
      name: 'user_creation_total',
      help: 'Total number of user creation attempts',
      labelNames: ['status'],
    }),
    makeCounterProvider({
      name: 'user_already_exists_total',
      help: 'Total number of attempts to create users with existing emails',
      labelNames: ['email_domain'],
    }),
    UserMetrics,
  ],
  exports: [PrometheusModule, UserMetrics],
})
export class MetricsModule {}
