import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { TaskResponsesModule } from '../task-responses/task-responses.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [TaskResponsesModule, TasksModule],
  providers: [TelegramService],
  controllers: [TelegramController],
  exports: [TelegramService]
})
export class TelegramModule {}
