import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private ai;
    private readonly logger;
    constructor(configService: ConfigService);
    generateDailyCoaching(analyticsData: any): Promise<any>;
}
