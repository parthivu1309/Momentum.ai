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
exports.shouldIncludeTaskToday = shouldIncludeTaskToday;
const common_1 = require("@nestjs/common");
const tasks_service_1 = require("../tasks/tasks.service");
const task_responses_service_1 = require("../task-responses/task-responses.service");
const ai_provider_service_1 = require("../ai/ai-provider.service");
function shouldIncludeTaskToday(repeatType, dayOfWeek) {
    const rt = (repeatType ?? '').trim().toLowerCase();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isMonWedFri = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
    const isTueThu = dayOfWeek === 2 || dayOfWeek === 4;
    if (!rt || rt === 'daily')
        return true;
    if (rt === 'weekdays' && !isWeekend)
        return true;
    if (rt === 'weekends' && isWeekend)
        return true;
    if (rt === 'mon-wed-fri' && isMonWedFri)
        return true;
    if (rt === 'tue-thu' && isTueThu)
        return true;
    return false;
}
(function runSelfTests() {
    const PASS = '✅';
    const FAIL = '❌';
    const results = [];
    function assert(label, actual, expected) {
        const ok = actual === expected;
        results.push(`  ${ok ? PASS : FAIL} ${label}: got ${actual}, expected ${expected}`);
        if (!ok) {
            console.error(`[shouldIncludeTaskToday] SELF-TEST FAILED: ${label}`);
        }
    }
    const TUE = 2;
    assert('"daily" on Tuesday', shouldIncludeTaskToday('daily', TUE), true);
    assert('"Daily" on Tuesday', shouldIncludeTaskToday('Daily', TUE), true);
    assert('"DAILY" on Tuesday', shouldIncludeTaskToday('DAILY', TUE), true);
    assert('undefined on Tuesday', shouldIncludeTaskToday(undefined, TUE), true);
    assert('null on Tuesday', shouldIncludeTaskToday(null, TUE), true);
    assert('"" on Tuesday', shouldIncludeTaskToday('', TUE), true);
    assert('"weekdays" on Tuesday', shouldIncludeTaskToday('weekdays', TUE), true);
    assert('"Weekdays" on Tuesday', shouldIncludeTaskToday('Weekdays', TUE), true);
    assert('"weekends" on Tuesday', shouldIncludeTaskToday('weekends', TUE), false);
    assert('"mon-wed-fri" on Tue', shouldIncludeTaskToday('mon-wed-fri', TUE), false);
    assert('"tue-thu" on Tuesday', shouldIncludeTaskToday('tue-thu', TUE), true);
    assert('"Tue-Thu" on Tuesday', shouldIncludeTaskToday('Tue-Thu', TUE), true);
    const MON = 1;
    assert('"mon-wed-fri" on Mon', shouldIncludeTaskToday('mon-wed-fri', MON), true);
    assert('"Mon-Wed-Fri" on Mon', shouldIncludeTaskToday('Mon-Wed-Fri', MON), true);
    assert('"tue-thu" on Monday', shouldIncludeTaskToday('tue-thu', MON), false);
    assert('"weekdays" on Monday', shouldIncludeTaskToday('weekdays', MON), true);
    assert('"weekends" on Monday', shouldIncludeTaskToday('weekends', MON), false);
    const SAT = 6;
    assert('"weekends" on Saturday', shouldIncludeTaskToday('weekends', SAT), true);
    assert('"weekdays" on Saturday', shouldIncludeTaskToday('weekdays', SAT), false);
    assert('"daily" on Saturday', shouldIncludeTaskToday('daily', SAT), true);
    const passed = results.filter(r => r.includes('✅')).length;
    const total = results.length;
    console.log(`[shouldIncludeTaskToday] Self-tests: ${passed}/${total} passed`);
    results.forEach(r => console.log(r));
})();
let AiReportService = AiReportService_1 = class AiReportService {
    tasksService;
    taskResponsesService;
    aiProvider;
    logger = new common_1.Logger(AiReportService_1.name);
    constructor(tasksService, taskResponsesService, aiProvider) {
        this.tasksService = tasksService;
        this.taskResponsesService = taskResponsesService;
        this.aiProvider = aiProvider;
    }
    async generateDailyReport() {
        const now = new Date();
        const todayDateStr = now.toLocaleDateString('en-CA');
        const dayOfWeek = now.getDay();
        const allTasks = await this.tasksService.findAll();
        const scheduledTasks = allTasks.filter(task => shouldIncludeTaskToday(task.repeatType, dayOfWeek));
        this.logger.log(`Daily report | date=${todayDateStr} | total tasks=${allTasks.length} | scheduled today=${scheduledTasks.length}`);
        const todayResponses = await this.taskResponsesService.findAll(todayDateStr);
        this.logger.log(`Daily report | responses for today=${todayResponses.length}`);
        const tasksData = scheduledTasks.map(task => {
            const response = todayResponses.find(r => r.taskId === task.id);
            let status = 'Pending';
            if (response) {
                status =
                    response.status === 'completed' ? 'Completed' :
                        response.status === 'missed' ? 'Missed' :
                            response.status === 'snooze' ? 'Snoozed' : 'Pending';
            }
            return {
                title: task.title,
                status,
                category: task.category,
                startTime: task.startTime,
                endTime: task.endTime,
            };
        });
        const scheduledTasksCount = scheduledTasks.length;
        const completedTasksCount = tasksData.filter(t => t.status === 'Completed').length;
        const missedTasksCount = tasksData.filter(t => t.status === 'Missed').length;
        const snoozedTasksCount = tasksData.filter(t => t.status === 'Snoozed').length;
        const completionRate = scheduledTasksCount > 0
            ? (completedTasksCount / scheduledTasksCount) * 100
            : 0;
        this.logger.log(`Daily report | scheduled=${scheduledTasksCount} | completed=${completedTasksCount} | missed=${missedTasksCount} | rate=${completionRate.toFixed(1)}%`);
        const reportData = {
            date: todayDateStr,
            scheduledTasks: scheduledTasksCount,
            completedTasks: completedTasksCount,
            missedTasks: missedTasksCount,
            snoozedTasks: snoozedTasksCount,
            completionRate: Number(completionRate.toFixed(1)),
            tasks: tasksData,
        };
        const userPrompt = `
Analyse the user's productivity based only on the supplied data.
Never invent facts.
Return markdown only.

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

Data:
${JSON.stringify(reportData, null, 2)}
`;
        try {
            const reportMarkdown = await this.aiProvider.generateMarkdown(userPrompt);
            this.logger.log('Daily report generated successfully');
            return {
                report: reportMarkdown,
                statistics: {
                    completionRate: reportData.completionRate,
                    completed: completedTasksCount,
                    missed: missedTasksCount,
                    snoozed: snoozedTasksCount,
                    scheduled: scheduledTasksCount,
                },
                generatedAt: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('Failed to generate AI report using Provider');
            this.logger.error(`Original Error: ${error.message}`);
            if (error.stack) {
                this.logger.error(`Stack: ${error.stack}`);
            }
            throw error;
        }
    }
};
exports.AiReportService = AiReportService;
exports.AiReportService = AiReportService = AiReportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tasks_service_1.TasksService,
        task_responses_service_1.TaskResponsesService,
        ai_provider_service_1.AiProviderService])
], AiReportService);
//# sourceMappingURL=ai-report.service.js.map