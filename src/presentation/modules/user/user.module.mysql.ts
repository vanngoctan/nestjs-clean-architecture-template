import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { CreateUserUseCase } from '../../../application/use-cases/user/create-user.use-case';
import { FindUserByEmailUseCase } from '../../../application/use-cases/user/find-user-by-email.use-case';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { UserModel } from '../../../infrastructure/database/mysql/models/user.model';
import { MySqlUserRepositoryImpl } from '../../../infrastructure/database/mysql/repositories/user.repository.impl';
import { MetricsModule } from '../../../infrastructure/metrics/metrics.module';
import { FeatureFlagModule } from '../../../infrastructure/feature-flags/feature-flag.module';
import { UserController } from './user.controller';
import { NotificationConsumer } from '../../../application/jobs/notification.consumer';

/**
 * User module for MySQL database
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel]),
    MetricsModule,
    BullModule.registerQueue({
      name: 'notification',
    }),
    FeatureFlagModule,
  ],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    FindUserByEmailUseCase,
    NotificationConsumer,
    {
      provide: IUserRepository,
      useClass: MySqlUserRepositoryImpl,
    },
  ],
})
export class UserModule {}
