import { ConfigService } from '@nestjs/config';
export declare class AiProviderService {
    private configService;
    private readonly logger;
    private readonly apiKey;
    private readonly baseURL;
    private readonly primaryModel;
    private readonly models;
    private readonly MAX_RETRIES;
    private readonly BASE_DELAY_MS;
    constructor(configService: ConfigService);
    getModel(): string;
    private fetchOnce;
    private fetchAI;
    generateMarkdown(userPrompt: string): Promise<string>;
    generateJson(userPrompt: string): Promise<any>;
    private sleep;
}
