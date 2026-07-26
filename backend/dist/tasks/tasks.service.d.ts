import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { DocumentData } from 'firebase-admin/firestore';
export declare class TasksService {
    private firebaseService;
    private readonly collection;
    constructor(firebaseService: FirebaseService);
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
    findOne(id: string): Promise<DocumentData | undefined>;
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<DocumentData | undefined>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
