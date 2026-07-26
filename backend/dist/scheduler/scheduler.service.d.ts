import { AnalyticsService } from '../analytics/analytics.service';
import { AiService } from '../ai/ai.service';
import { ReportsService } from '../reports/reports.service';
import { TasksService } from '../tasks/tasks.service';
import { TelegramService } from '../telegram/telegram.service';
import { ConfigService } from '@nestjs/config';
export declare class SchedulerService {
    private analyticsService;
    private aiService;
    private reportsService;
    private tasksService;
    private telegramService;
    private configService;
    private readonly logger;
    constructor(analyticsService: AnalyticsService, aiService: AiService, reportsService: ReportsService, tasksService: TasksService, telegramService: TelegramService, configService: ConfigService);
    handleReminderCheck(): Promise<void>;
    generateDailyReport(): Promise<void>;
}
