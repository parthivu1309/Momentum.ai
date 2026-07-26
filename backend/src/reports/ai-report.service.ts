import { Injectable, Logger } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { TaskResponsesService } from '../task-responses/task-responses.service';
import { AiProviderService } from '../ai/ai-provider.service';

@Injectable()
export class AiReportService {
  private readonly logger = new Logger(AiReportService.name);

  constructor(
    private tasksService: TasksService,
    private taskResponsesService: TaskResponsesService,
    private aiProvider: AiProviderService
  ) {}

  async generateDailyReport(): Promise<any> {
    this.logger.log("Loading today's tasks...");
    const allTasks = await this.tasksService.findAll();
    
    // Determine which tasks are scheduled for today
    const now = new Date();
    // Use local timezone for date string just to query task responses consistently
    const todayDateStr = now.toLocaleDateString('en-CA'); 
    
    const dayOfWeek = now.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isMonWedFri = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
    const isTueThu = dayOfWeek === 2 || dayOfWeek === 4;

    const scheduledTasks = allTasks.filter(task => {
      if (!task.repeatType || task.repeatType === 'Daily') return true;
      if (task.repeatType === 'Weekdays' && !isWeekend) return true;
      if (task.repeatType === 'Weekends' && isWeekend) return true;
      if (task.repeatType === 'Mon-Wed-Fri' && isMonWedFri) return true;
      if (task.repeatType === 'Tue-Thu' && isTueThu) return true;
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

    this.logger.log('Building report prompt...');
    const systemPrompt = `You are an AI discipline coach.
Analyse the user's productivity based only on the supplied data.
Never invent facts.
Return markdown only.`;

    const userPrompt = `
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
      const reportMarkdown = await this.aiProvider.generateMarkdown(systemPrompt, userPrompt);
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
    } catch (error) {
      this.logger.error('Failed to generate AI report using Provider', error);
      throw new Error('Failed to generate AI report');
    }
  }
}
