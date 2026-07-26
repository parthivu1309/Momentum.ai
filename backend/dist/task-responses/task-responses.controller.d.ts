import { TaskResponsesService } from './task-responses.service';
import { CreateTaskResponseDto } from './dto/create-task-response.dto';
import { UpdateTaskResponseDto } from './dto/update-task-response.dto';
export declare class TaskResponsesController {
    private readonly taskResponsesService;
    constructor(taskResponsesService: TaskResponsesService);
    create(createTaskResponseDto: CreateTaskResponseDto): Promise<{
        createdAt: string;
        taskId: string;
        date: string;
        status: string;
        reason?: string;
        id: string;
        userId: string;
    }>;
    findAll(date?: string): Promise<any[]>;
    findOne(id: string): Promise<FirebaseFirestore.DocumentData | undefined>;
    update(id: string, updateTaskResponseDto: UpdateTaskResponseDto): Promise<FirebaseFirestore.DocumentData | undefined>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
