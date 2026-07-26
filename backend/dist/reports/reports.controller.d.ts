import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    findAll(type?: string): Promise<any[]>;
    findOne(id: string): Promise<FirebaseFirestore.DocumentData | undefined>;
}
