import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HealthController } from "./health.controller";

/**
 * Module responsible for health checks across the application
 */
@Module({
  imports: [TerminusModule, TypeOrmModule, MongooseModule, ConfigModule],
  controllers: [HealthController],
})
export class HealthModule {}
