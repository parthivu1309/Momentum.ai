import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
export declare class TimetableController {
    private readonly timetableService;
    constructor(timetableService: TimetableService);
    create(createTimetableDto: CreateTimetableDto): Promise<{
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        title: string;
        id: string;
        userId: string;
    }>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<FirebaseFirestore.DocumentData | undefined>;
    update(id: string, updateTimetableDto: UpdateTimetableDto): Promise<FirebaseFirestore.DocumentData | undefined>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
