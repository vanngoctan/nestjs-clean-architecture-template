import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongoModel, UserSchema } from './schemas/user.schema';

/**
 * Module that configures the MongoDB database connection using Mongoose.
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/nestjs_clean_arch'),
      }),
    }),
  ],
})
export class MongoDatabaseModule {}
