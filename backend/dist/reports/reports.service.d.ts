import { CreateReportDto } from './dto/create-report.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { DocumentData } from 'firebase-admin/firestore';
export declare class ReportsService {
    private firebaseService;
    private readonly collection;
    private readonly userId;
    constructor(firebaseService: FirebaseService);
    create(createReportDto: CreateReportDto): Promise<{
        createdAt: string;
        type: string;
        date: string;
        analyticsSnapshot?: any;
        aiSummary?: string;
        id: string;
        userId: string;
    }>;
    findAll(type?: string): Promise<any[]>;
    findOne(id: string): Promise<DocumentData | undefined>;
}
