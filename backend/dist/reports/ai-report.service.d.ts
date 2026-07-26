import { ConfigService } from '@nestjs/config';
import { TasksService } from '../tasks/tasks.service';
import { TaskResponsesService } from '../task-responses/task-responses.service';
export declare class AiReportService {
    private configService;
    private tasksService;
    private taskResponsesService;
    private ai;
    private readonly logger;
    constructor(configService: ConfigService, tasksService: TasksService, taskResponsesService: TaskResponsesService);
    generateDailyReport(): Promise<any>;
}
