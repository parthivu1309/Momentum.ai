import { Module } from '@nestjs/common';
import { TaskResponsesService } from './task-responses.service';
import { TaskResponsesController } from './task-responses.controller';

@Module({
  controllers: [TaskResponsesController],
  providers: [TaskResponsesService],
  exports: [TaskResponsesService]
})
export class TaskResponsesModule {}
