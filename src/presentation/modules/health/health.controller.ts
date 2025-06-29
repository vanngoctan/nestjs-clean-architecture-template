import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
  TypeOrmHealthIndicator,
  MongooseHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from "@nestjs/terminus";
import { ConfigService } from "@nestjs/config";
import { Logger } from "nestjs-pino";

/**
 * Controller for health check endpoints
 */
@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private typeOrmHealth: TypeOrmHealthIndicator,
    private mongooseHealth: MongooseHealthIndicator,
    private memoryHealth: MemoryHealthIndicator,
    private configService: ConfigService,
    private readonly logger: Logger
  ) {}

  /**
   * Simple liveness probe to check if the application is running
   */
  @Get("live")
  @ApiOperation({ summary: "Verify that the application is running" })
  getLiveness(): { status: string } {
    return { status: "ok" };
  }

  /**
   * Comprehensive readiness probe that checks critical dependencies
   */
  @Get("ready")
  @ApiOperation({
    summary: "Verify that the application is ready to accept requests",
  })
  @HealthCheck()
  async getReadiness(): Promise<HealthCheckResult> {
    const dbType = this.configService.get<string>("DATABASE_TYPE", "mysql");

    this.logger.log("Running health checks...");

    return this.health.check([
      // Check memory usage (shared regardless of DB type)
      async () => this.memoryHealth.checkHeap("memory_heap", 250 * 1024 * 1024), // 250MB

      // Database health check based on configured database type
      async () => {
        if (dbType === "mongodb") {
          return this.mongooseHealth.pingCheck("mongodb", {
            timeout: 1000,
            connection: "default",
          });
        } else {
          return this.typeOrmHealth.pingCheck("mysql", {
            timeout: 1000,
          });
        }
      },
    ]);
  }
}
