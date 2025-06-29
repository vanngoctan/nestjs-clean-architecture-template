import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { PrometheusController } from '@willsoto/nestjs-prometheus';
import { ApiOperation, ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Controller for exposing application metrics.
 *
 * This controller extends the PrometheusController to expose metrics in a format
 * that can be scraped by Prometheus.
 */
@ApiTags('metrics')
@Controller('metrics')
export class MetricsController extends PrometheusController {
  /**
   * Get application metrics in Prometheus format.
   * This endpoint is excluded from Swagger documentation as it's meant for monitoring systems.
   */
  @Get('metrics')
  @ApiExcludeEndpoint() // Hide from Swagger docs
  @UseGuards(ThrottlerGuard) // Apply rate limiting
  @ApiOperation({ summary: 'Get application metrics in Prometheus format' })
  getMetrics(@Res() res: Response): any {
    return super.index(res);
  }
}
