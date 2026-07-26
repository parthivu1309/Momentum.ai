import { CreateReportDto } from './dto/create-report.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { AiReportService } from './ai-report.service';
import { DocumentData } from 'firebase-admin/firestore';
export declare class ReportsService {
    private firebaseService;
    private aiReportService;
    private readonly collection;
    private readonly userId;
    private readonly logger;
    constructor(firebaseService: FirebaseService, aiReportService: AiReportService);
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
    getDailyReport(refresh?: boolean): Promise<any>;
}
