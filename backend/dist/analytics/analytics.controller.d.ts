import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDailyMetrics(date: string): Promise<{
        date: string;
        totalScheduled: number;
        completed: number;
        missed: number;
        snoozed: number;
        skipped: number;
        completionRate: number;
        disciplineScore: number;
        mostSkippedHabit: any;
        topFailureReason: string | null;
        currentStreak: number;
    }>;
}
