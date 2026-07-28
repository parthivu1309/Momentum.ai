import { Injectable, Logger } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { TaskResponsesService } from '../task-responses/task-responses.service';
import { AiProviderService } from '../ai/ai-provider.service';

/**
 * Returns true if the task should be included in today's schedule.
 * Normalizes repeatType to lowercase + trimmed before comparison
 * so that "Daily", "daily", "DAILY" all behave identically.
 *
 * @param repeatType   - raw repeatType value from Firestore (may be undefined/null)
 * @param dayOfWeek    - result of new Date().getDay()  (0=Sun … 6=Sat)
 */
export function shouldIncludeTaskToday(
  repeatType: string | undefined | null,
  dayOfWeek: number,
): boolean {
  const rt = (repeatType ?? '').trim().toLowerCase();

  const isWeekend   = dayOfWeek === 0 || dayOfWeek === 6;
  const isMonWedFri = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
  const isTueThu    = dayOfWeek === 2 || dayOfWeek === 4;

  if (!rt || rt === 'daily')               return true;
  if (rt === 'weekdays' && !isWeekend)     return true;
  if (rt === 'weekends' && isWeekend)      return true;
  if (rt === 'mon-wed-fri' && isMonWedFri) return true;
  if (rt === 'tue-thu' && isTueThu)        return true;

  return false;
}

// ─── Inline unit tests for shouldIncludeTaskToday() ──────────────────────────
// Run once at module load. Failures are logged as ERRORs so they surface in
// any environment. Remove this block (lines below up to the closing ```) once
// the test suite is integrated into Jest.
(function runSelfTests() {
  const PASS = '✅';
  const FAIL = '❌';
  const results: string[] = [];

  function assert(label: string, actual: boolean, expected: boolean) {
    const ok = actual === expected;
    results.push(`  ${ok ? PASS : FAIL} ${label}: got ${actual}, expected ${expected}`);
    if (!ok) {
      // Using console.error so it always shows regardless of NestJS log level
      console.error(`[shouldIncludeTaskToday] SELF-TEST FAILED: ${label}`);
    }
  }

  // Tuesday (dayOfWeek = 2)
  const TUE = 2;
  assert('"daily" on Tuesday',    shouldIncludeTaskToday('daily',       TUE), true);
  assert('"Daily" on Tuesday',    shouldIncludeTaskToday('Daily',       TUE), true);
  assert('"DAILY" on Tuesday',    shouldIncludeTaskToday('DAILY',       TUE), true);
  assert('undefined on Tuesday',  shouldIncludeTaskToday(undefined,     TUE), true);
  assert('null on Tuesday',       shouldIncludeTaskToday(null,          TUE), true);
  assert('"" on Tuesday',         shouldIncludeTaskToday('',            TUE), true);
  assert('"weekdays" on Tuesday', shouldIncludeTaskToday('weekdays',    TUE), true);
  assert('"Weekdays" on Tuesday', shouldIncludeTaskToday('Weekdays',    TUE), true);
  assert('"weekends" on Tuesday', shouldIncludeTaskToday('weekends',    TUE), false);
  assert('"mon-wed-fri" on Tue',  shouldIncludeTaskToday('mon-wed-fri', TUE), false);
  assert('"tue-thu" on Tuesday',  shouldIncludeTaskToday('tue-thu',     TUE), true);
  assert('"Tue-Thu" on Tuesday',  shouldIncludeTaskToday('Tue-Thu',     TUE), true);

  // Monday (dayOfWeek = 1)
  const MON = 1;
  assert('"mon-wed-fri" on Mon',  shouldIncludeTaskToday('mon-wed-fri', MON), true);
  assert('"Mon-Wed-Fri" on Mon',  shouldIncludeTaskToday('Mon-Wed-Fri', MON), true);
  assert('"tue-thu" on Monday',   shouldIncludeTaskToday('tue-thu',     MON), false);
  assert('"weekdays" on Monday',  shouldIncludeTaskToday('weekdays',    MON), true);
  assert('"weekends" on Monday',  shouldIncludeTaskToday('weekends',    MON), false);

  // Saturday (dayOfWeek = 6)
  const SAT = 6;
  assert('"weekends" on Saturday', shouldIncludeTaskToday('weekends',  SAT), true);
  assert('"weekdays" on Saturday', shouldIncludeTaskToday('weekdays',  SAT), false);
  assert('"daily" on Saturday',    shouldIncludeTaskToday('daily',     SAT), true);

  const passed = results.filter(r => r.includes('✅')).length;
  const total  = results.length;
  console.log(`[shouldIncludeTaskToday] Self-tests: ${passed}/${total} passed`);
  results.forEach(r => console.log(r));
})();
// ─── end self-tests ───────────────────────────────────────────────────────────

@Injectable()
export class AiReportService {
  private readonly logger = new Logger(AiReportService.name);

  constructor(
    private tasksService: TasksService,
    private taskResponsesService: TaskResponsesService,
    private aiProvider: AiProviderService,
  ) {}

  async generateDailyReport(): Promise<any> {
    const now          = new Date();
    const todayDateStr = now.toLocaleDateString('en-CA'); // e.g. "2026-07-28"
    const dayOfWeek    = now.getDay();

    // ── Fetch all tasks ──────────────────────────────────────────────────────
    const allTasks      = await this.tasksService.findAll();
    const scheduledTasks = allTasks.filter(task =>
      shouldIncludeTaskToday(task.repeatType, dayOfWeek),
    );

    this.logger.log(
      `Daily report | date=${todayDateStr} | total tasks=${allTasks.length} | scheduled today=${scheduledTasks.length}`,
    );

    // ── Fetch today's responses ──────────────────────────────────────────────
    const todayResponses = await this.taskResponsesService.findAll(todayDateStr);

    this.logger.log(`Daily report | responses for today=${todayResponses.length}`);

    // ── Map status onto each scheduled task ─────────────────────────────────
    const tasksData = scheduledTasks.map(task => {
      const response = todayResponses.find(r => r.taskId === task.id);

      let status = 'Pending';
      if (response) {
        status =
          response.status === 'completed' ? 'Completed' :
          response.status === 'missed'    ? 'Missed'    :
          response.status === 'snooze'    ? 'Snoozed'   : 'Pending';
      }

      return {
        title:     task.title,
        status,
        category:  task.category,
        startTime: task.startTime,
        endTime:   task.endTime,
      };
    });

    // ── Calculate metrics ────────────────────────────────────────────────────
    const scheduledTasksCount = scheduledTasks.length;
    const completedTasksCount = tasksData.filter(t => t.status === 'Completed').length;
    const missedTasksCount    = tasksData.filter(t => t.status === 'Missed').length;
    const snoozedTasksCount   = tasksData.filter(t => t.status === 'Snoozed').length;
    const completionRate      = scheduledTasksCount > 0
      ? (completedTasksCount / scheduledTasksCount) * 100
      : 0;

    this.logger.log(
      `Daily report | scheduled=${scheduledTasksCount} | completed=${completedTasksCount} | missed=${missedTasksCount} | rate=${completionRate.toFixed(1)}%`,
    );

    const reportData = {
      date:           todayDateStr,
      scheduledTasks: scheduledTasksCount,
      completedTasks: completedTasksCount,
      missedTasks:    missedTasksCount,
      snoozedTasks:   snoozedTasksCount,
      completionRate: Number(completionRate.toFixed(1)),
      tasks:          tasksData,
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
          completed:      completedTasksCount,
          missed:         missedTasksCount,
          snoozed:        snoozedTasksCount,
          scheduled:      scheduledTasksCount,
        },
        generatedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      this.logger.error('Failed to generate AI report using Provider');
      this.logger.error(`Original Error: ${error.message}`);
      if (error.stack) {
        this.logger.error(`Stack: ${error.stack}`);
      }
      throw error;
    }
  }
}
