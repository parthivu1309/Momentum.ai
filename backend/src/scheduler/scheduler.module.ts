import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { AnalyticsModule } from '../analytics/analytics.module';
import { AiModule } from '../ai/ai.module';
import { ReportsModule } from '../reports/reports.module';
import { TasksModule } from '../tasks/tasks.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [AnalyticsModule, AiModule, ReportsModule, TasksModule, TelegramModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
