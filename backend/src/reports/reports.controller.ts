import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily')
  @ApiOperation({ summary: "Get today's AI Daily Report" })
  @ApiQuery({ name: 'refresh', required: false, type: Boolean })
  getDailyReport(@Query('refresh') refresh?: string) {
    const shouldRefresh = refresh === 'true';
    return this.reportsService.getDailyReport(shouldRefresh);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  @ApiQuery({ name: 'type', required: false })
  findAll(@Query('type') type?: string) {
    return this.reportsService.findAll(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific report by ID' })
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }
}
