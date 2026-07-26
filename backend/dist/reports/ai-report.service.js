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
var AiReportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiReportService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const genai_1 = require("@google/genai");
const tasks_service_1 = require("../tasks/tasks.service");
const task_responses_service_1 = require("../task-responses/task-responses.service");
let AiReportService = AiReportService_1 = class AiReportService {
    configService;
    tasksService;
    taskResponsesService;
    ai = null;
    logger = new common_1.Logger(AiReportService_1.name);
    constructor(configService, tasksService, taskResponsesService) {
        this.configService = configService;
        this.tasksService = tasksService;
        this.taskResponsesService = taskResponsesService;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (apiKey) {
            this.ai = new genai_1.GoogleGenAI({ apiKey });
        }
        else {
            this.logger.warn('GEMINI_API_KEY is not set. AI reports will fail.');
        }
    }
    async generateDailyReport() {
        if (!this.ai) {
            throw new Error('AI not configured (Missing GEMINI_API_KEY)');
        }
        this.logger.log("Loading today's tasks...");
        const allTasks = await this.tasksService.findAll();
        const now = new Date();
        const todayDateStr = now.toLocaleDateString('en-CA');
        const dayOfWeek = now.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isMonWedFri = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
        const isTueThu = dayOfWeek === 2 || dayOfWeek === 4;
        const scheduledTasks = allTasks.filter(task => {
            if (!task.repeatType || task.repeatType === 'Daily')
                return true;
            if (task.repeatType === 'Weekdays' && !isWeekend)
                return true;
            if (task.repeatType === 'Weekends' && isWeekend)
                return true;
            if (task.repeatType === 'Mon-Wed-Fri' && isMonWedFri)
                return true;
            if (task.repeatType === 'Tue-Thu' && isTueThu)
                return true;
            return false;
        });
        this.logger.log('Loading task responses...');
        const todayResponses = await this.taskResponsesService.findAll(todayDateStr);
        const tasksData = scheduledTasks.map(task => {
            const response = todayResponses.find(r => r.taskId === task.id);
            let status = 'Pending';
            if (response) {
                status = response.status === 'completed' ? 'Completed' :
                    response.status === 'missed' ? 'Missed' :
                        response.status === 'snooze' ? 'Snoozed' : 'Pending';
            }
            return {
                title: task.title,
                status,
                category: task.category,
                startTime: task.startTime,
                endTime: task.endTime
            };
        });
        const completedTasksCount = tasksData.filter(t => t.status === 'Completed').length;
        const missedTasksCount = tasksData.filter(t => t.status === 'Missed').length;
        const snoozedTasksCount = tasksData.filter(t => t.status === 'Snoozed').length;
        const scheduledTasksCount = scheduledTasks.length;
        const completionRate = scheduledTasksCount > 0 ? (completedTasksCount / scheduledTasksCount) * 100 : 0;
        const reportData = {
            date: todayDateStr,
            scheduledTasks: scheduledTasksCount,
            completedTasks: completedTasksCount,
            missedTasks: missedTasksCount,
            snoozedTasks: snoozedTasksCount,
            completionRate: Number(completionRate.toFixed(1)),
            tasks: tasksData
        };
        this.logger.log('Generating prompt...');
        const prompt = `
You are an AI discipline coach.
Analyse today's productivity.
Write a concise report.
Return ONLY markdown.

Include:
# Daily Report
## Summary
Overall performance.

## Strengths
Mention good habits.

## Weaknesses
Mention missed tasks.

## Suggestions
3 practical improvements.

## Motivation
End with a short motivating paragraph.

Keep the report under 400 words.
Never hallucinate.
Use only the supplied data.

Data:
${JSON.stringify(reportData, null, 2)}
`;
        this.logger.log('Calling Gemini...');
        try {
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: prompt,
            });
            this.logger.log('Gemini success');
            let reportMarkdown = response.text || '';
            if (reportMarkdown.startsWith('```markdown')) {
                reportMarkdown = reportMarkdown.replace(/^```markdown\n/, '').replace(/\n```$/, '');
            }
            else if (reportMarkdown.startsWith('```')) {
                reportMarkdown = reportMarkdown.replace(/^```\n/, '').replace(/\n```$/, '');
            }
            this.logger.log('Returning report');
            return {
                report: reportMarkdown,
                statistics: {
                    completionRate: reportData.completionRate,
                    completed: completedTasksCount,
                    missed: missedTasksCount,
                    snoozed: snoozedTasksCount,
                    scheduled: scheduledTasksCount
                },
                generatedAt: new Date().toISOString()
            };
        }
        catch (error) {
            this.logger.error('Gemini error:', error);
            throw new Error('Failed to generate AI report');
        }
    }
};
exports.AiReportService = AiReportService;
exports.AiReportService = AiReportService = AiReportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        tasks_service_1.TasksService,
        task_responses_service_1.TaskResponsesService])
], AiReportService);
//# sourceMappingURL=ai-report.service.js.map