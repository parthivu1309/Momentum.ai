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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
let AnalyticsService = class AnalyticsService {
    firebaseService;
    userId = 'default-user';
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async calculateDailyMetrics(date) {
        const snapshot = await this.firebaseService.firestore
            .collection('task_responses')
            .where('userId', '==', this.userId)
            .where('date', '==', date)
            .get();
        const responses = snapshot.docs.map((doc) => doc.data());
        let completed = 0;
        let missed = 0;
        let snoozed = 0;
        let skipped = 0;
        const failureReasons = {};
        const taskMisses = {};
        responses.forEach((r) => {
            switch (r.status) {
                case 'completed':
                    completed++;
                    break;
                case 'missed':
                    missed++;
                    break;
                case 'snoozed':
                    snoozed++;
                    break;
                case 'skipped':
                    skipped++;
                    break;
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
        const disciplineScore = completionRate;
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
        if (mostSkippedHabit) {
            try {
                const taskDoc = await this.firebaseService.firestore.collection('tasks').doc(mostSkippedHabit).get();
                if (taskDoc.exists) {
                    mostSkippedHabit = taskDoc.data()?.title;
                }
            }
            catch (e) {
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
    async calculateCurrentStreak() {
        return 1;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map