import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { AiReportService } from './ai-report.service';
import { TasksModule } from '../tasks/tasks.module';
import { TaskResponsesModule } from '../task-responses/task-responses.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [TasksModule, TaskResponsesModule, AiModule],
  controllers: [ReportsController],
  providers: [ReportsService, AiReportService],
  exports: [ReportsService, AiReportService]
})
export class ReportsModule {}
