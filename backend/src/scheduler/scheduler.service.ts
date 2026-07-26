import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AnalyticsService } from '../analytics/analytics.service';
import { AiService } from '../ai/ai.service';
import { ReportsService } from '../reports/reports.service';
import { TasksService } from '../tasks/tasks.service';
import { TelegramService } from '../telegram/telegram.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private analyticsService: AnalyticsService,
    private aiService: AiService,
    private reportsService: ReportsService,
    private tasksService: TasksService,
    private telegramService: TelegramService,
    private configService: ConfigService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleReminderCheck() {
    this.logger.log('Cron job executed');

    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-GB', { 
      timeZone: 'Asia/Kolkata', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
    const normalizedTimeString = formatter.format(now).replace(/^24/, '00');

    this.logger.log(`Comparing against Kolkata time: ${normalizedTimeString} (UTC: ${now.toISOString()})`);

    // fetch all tasks to evaluate match logic
    const allTasks = await this.tasksService.findAll();
    
    this.logger.log(`Firestore Query: collection('tasks').get() -> returned ${allTasks.length} total tasks`);

    const dueTasks = allTasks.filter(task => {
      const match = task.startTime === normalizedTimeString;
      this.logger.log(` - Task [${task.title || task.id}]: scheduled at ${task.startTime} | match? ${match}`);
      return match;
    });

    this.logger.log(`Found ${dueTasks.length} due tasks for time ${normalizedTimeString}`);

    const chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
    this.logger.log(`Loaded TELEGRAM_CHAT_ID from env: ${chatId ? 'Yes' : 'No'} (Value: ${chatId})`);

    for (const task of dueTasks) {
       this.logger.log(`Invoking TelegramService for task: ${task.title}`);
       const text = `🔔 **Reminder:** ${task.title}\nAre you ready to complete this?`;
       
       const replyMarkup = {
         inline_keyboard: [
           [
             { text: '✅ Completed', callback_data: `action_completed_${task.id}` },
             { text: '❌ Missed', callback_data: `action_missed_${task.id}` }
           ],
           [
             { text: '💤 Snooze (15m)', callback_data: `action_snooze_${task.id}` }
           ]
         ]
       };
       await this.telegramService.sendMessage(chatId!, text, replyMarkup);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailyReport() {
    this.logger.log('Starting daily report generation...');
    
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0];

      const analytics = await this.analyticsService.calculateDailyMetrics(dateStr);
      const aiSummary = await this.aiService.generateDailyCoaching(analytics);

      await this.reportsService.create({
        type: 'daily',
        date: dateStr,
        analyticsSnapshot: analytics,
        aiSummary: JSON.stringify(aiSummary)
      });

      this.logger.log('Daily report generated successfully.');
    } catch (e) {
      this.logger.error('Failed to generate daily report', e);
    }
  }
}
