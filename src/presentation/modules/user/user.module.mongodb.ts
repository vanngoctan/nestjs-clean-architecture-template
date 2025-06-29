import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { CreateUserUseCase } from '../../../application/use-cases/user/create-user.use-case';
import { FindUserByEmailUseCase } from '../../../application/use-cases/user/find-user-by-email.use-case';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import {
  UserMongoModel,
  UserSchema,
} from '../../../infrastructure/database/mongodb/schemas/user.schema';
import { MongoUserRepositoryImpl } from '../../../infrastructure/database/mongodb/repositories/user.repository.impl';
import { MetricsModule } from '../../../infrastructure/metrics/metrics.module';
import { FeatureFlagModule } from '../../../infrastructure/feature-flags/feature-flag.module';
import { UserController } from './user.controller';
import { NotificationConsumer } from '../../../application/jobs/notification.consumer';

/**
 * User module for MongoDB database
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserMongoModel.name, schema: UserSchema },
    ]),
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
      useClass: MongoUserRepositoryImpl,
    },
  ],
})
export class UserModule {}
