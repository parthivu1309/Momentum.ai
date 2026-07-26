import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Calculate daily deterministic metrics' })
  @ApiQuery({ name: 'date', required: true, example: '2026-07-26' })
  getDailyMetrics(@Query('date') date: string) {
    return this.analyticsService.calculateDailyMetrics(date);
  }
}
