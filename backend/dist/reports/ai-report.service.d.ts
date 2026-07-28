import { TasksService } from '../tasks/tasks.service';
import { TaskResponsesService } from '../task-responses/task-responses.service';
import { AiProviderService } from '../ai/ai-provider.service';
export declare function shouldIncludeTaskToday(repeatType: string | undefined | null, dayOfWeek: number): boolean;
export declare class AiReportService {
    private tasksService;
    private taskResponsesService;
    private aiProvider;
    private readonly logger;
    constructor(tasksService: TasksService, taskResponsesService: TaskResponsesService, aiProvider: AiProviderService);
    generateDailyReport(): Promise<any>;
}
