"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const analytics_service_1 = require("../analytics/analytics.service");
const ai_provider_service_1 = require("../ai/ai-provider.service");
const reports_service_1 = require("../reports/reports.service");
const tasks_service_1 = require("../tasks/tasks.service");
const telegram_service_1 = require("../telegram/telegram.service");
const config_1 = require("@nestjs/config");
let SchedulerService = SchedulerService_1 = class SchedulerService {
    analyticsService;
    aiService;
    reportsService;
    tasksService;
    telegramService;
    configService;
    logger = new common_1.Logger(SchedulerService_1.name);
    constructor(analyticsService, aiService, reportsService, tasksService, telegramService, configService) {
        this.analyticsService = analyticsService;
        this.aiService = aiService;
        this.reportsService = reportsService;
        this.tasksService = tasksService;
        this.telegramService = telegramService;
        this.configService = configService;
    }
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
        const allTasks = await this.tasksService.findAll();
        this.logger.log(`Firestore Query: collection('tasks').get() -> returned ${allTasks.length} total tasks`);
        const dueTasks = allTasks.filter(task => {
            const match = task.startTime === normalizedTimeString;
            this.logger.log(` - Task [${task.title || task.id}]: scheduled at ${task.startTime} | match? ${match}`);
            return match;
        });
        this.logger.log(`Found ${dueTasks.length} due tasks for time ${normalizedTimeString}`);
        const chatId = this.configService.get('TELEGRAM_CHAT_ID');
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
            await this.telegramService.sendMessage(chatId, text, replyMarkup);
        }
    }
    async generateDailyReport() {
        this.logger.log('Starting daily report generation...');
        try {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const dateStr = yesterday.toISOString().split('T')[0];
            const analytics = await this.analyticsService.calculateDailyMetrics(dateStr);
            const systemPrompt = `You are Momentum.AI, a tough but fair discipline coach.
Based on the following daily analytics, generate a structured coaching response.
Return a JSON object with:
- summary: string (a short punchy summary of the day)
- biggestAchievement: string
- biggestWeakness: string
- recommendation: string
- motivation: string`;
            const userPrompt = `Analytics:\n${JSON.stringify(analytics, null, 2)}`;
            const aiSummary = await this.aiService.generateJson(systemPrompt, userPrompt);
            await this.reportsService.create({
                type: 'daily',
                date: dateStr,
                analyticsSnapshot: analytics,
                aiSummary: JSON.stringify(aiSummary)
            });
            this.logger.log('Daily report generated successfully.');
        }
        catch (e) {
            this.logger.error('Failed to generate daily report', e);
        }
    }
};
exports.SchedulerService = SchedulerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "handleReminderCheck", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "generateDailyReport", null);
exports.SchedulerService = SchedulerService = SchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService,
        ai_provider_service_1.AiProviderService,
        reports_service_1.ReportsService,
        tasks_service_1.TasksService,
        telegram_service_1.TelegramService,
        config_1.ConfigService])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map