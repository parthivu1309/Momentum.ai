import { CreateTaskResponseDto } from './dto/create-task-response.dto';
import { UpdateTaskResponseDto } from './dto/update-task-response.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { DocumentData } from 'firebase-admin/firestore';
export declare class TaskResponsesService {
    private firebaseService;
    private readonly collection;
    private readonly userId;
    constructor(firebaseService: FirebaseService);
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
    findOne(id: string): Promise<DocumentData | undefined>;
    update(id: string, updateTaskResponseDto: UpdateTaskResponseDto): Promise<DocumentData | undefined>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
