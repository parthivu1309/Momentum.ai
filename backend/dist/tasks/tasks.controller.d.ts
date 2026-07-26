import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto): Promise<{
        createdAt: string;
        updatedAt: string;
        timetableId: string;
        title: string;
        description?: string;
        startTime: string;
        endTime: string;
        repeatType: string;
        category?: string;
        order?: number;
        id: string;
    }>;
    findAll(timetableId?: string): Promise<any[]>;
    findOne(id: string): Promise<FirebaseFirestore.DocumentData | undefined>;
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<FirebaseFirestore.DocumentData | undefined>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
