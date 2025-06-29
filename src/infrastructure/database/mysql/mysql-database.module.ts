import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModel } from "./models/user.model";
import { dataSourceOptions } from "../../../../db/data-source";

/**
 * Module that configures the MySQL database connection using TypeORM.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...dataSourceOptions,
        synchronize:
          configService.get<string>("NODE_ENV") !== "production" &&
          configService.get<boolean>("DB_SYNCHRONIZE") === true,
        logging: configService.get<string>("NODE_ENV") !== "production",
      }),
    }),
  ],
})
export class MysqlDatabaseModule {}
