import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AnalyticsService {
  private readonly userId = 'default-user'; // Single-user MVP

  constructor(private firebaseService: FirebaseService) {}

  async calculateDailyMetrics(date: string) {
    const snapshot = await this.firebaseService.firestore
      .collection('task_responses')
      .where('userId', '==', this.userId)
      .where('date', '==', date)
      .get();
      
    const responses = snapshot.docs.map((doc: any) => doc.data());
    
    let completed = 0;
    let missed = 0;
    let snoozed = 0;
    let skipped = 0;
    const failureReasons: Record<string, number> = {};
    const taskMisses: Record<string, number> = {};

    responses.forEach((r: any) => {
      switch (r.status) {
        case 'completed': completed++; break;
        case 'missed': missed++; break;
        case 'snoozed': snoozed++; break;
        case 'skipped': skipped++; break;
      }

      if (r.status === 'missed' || r.status === 'skipped') {
        if (r.reason) {
          failureReasons[r.reason] = (failureReasons[r.reason] || 0) + 1;
        }
        taskMisses[r.taskId] = (taskMisses[r.taskId] || 0) + 1;
      }
    });

    const totalScheduled = responses.length;
    const completionRate = totalScheduled > 0 ? Math.round((completed / totalScheduled) * 100) : 0;
    const disciplineScore = completionRate; // Basic formula for MVP

    let mostSkippedHabit = null;
    let mostSkippedCount = 0;
    for (const [taskId, count] of Object.entries(taskMisses)) {
      if (count > mostSkippedCount) {
        mostSkippedCount = count;
        mostSkippedHabit = taskId;
      }
    }

    let topFailureReason = null;
    let topFailureCount = 0;
    for (const [reason, count] of Object.entries(failureReasons)) {
      if (count > topFailureCount) {
        topFailureCount = count;
        topFailureReason = reason;
      }
    }

    // Resolve task name for mostSkippedHabit if present
    if (mostSkippedHabit) {
      try {
        const taskDoc = await this.firebaseService.firestore.collection('tasks').doc(mostSkippedHabit).get();
        if (taskDoc.exists) {
          mostSkippedHabit = taskDoc.data()?.title;
        }
      } catch (e) {
        // ignore
      }
    }

    const currentStreak = await this.calculateCurrentStreak();

    return {
      date,
      totalScheduled,
      completed,
      missed,
      snoozed,
      skipped,
      completionRate,
      disciplineScore,
      mostSkippedHabit,
      topFailureReason,
      currentStreak
    };
  }

  private async calculateCurrentStreak(): Promise<number> {
    return 1; // Basic stub for streak calculation
  }
}
