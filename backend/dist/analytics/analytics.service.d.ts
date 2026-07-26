import { FirebaseService } from '../firebase/firebase.service';
export declare class AnalyticsService {
    private firebaseService;
    private readonly userId;
    constructor(firebaseService: FirebaseService);
    calculateDailyMetrics(date: string): Promise<{
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
    private calculateCurrentStreak;
}
