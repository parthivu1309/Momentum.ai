import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { TimetableModule } from './timetable/timetable.module';
import { TasksModule } from './tasks/tasks.module';
import { TaskResponsesModule } from './task-responses/task-responses.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TelegramModule } from './telegram/telegram.module';
import { AiModule } from './ai/ai.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    FirebaseModule,
    TimetableModule,
    TasksModule,
    TaskResponsesModule,
    AnalyticsModule,
    TelegramModule,
    AiModule,
    SchedulerModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
