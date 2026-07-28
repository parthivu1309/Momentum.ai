import { ConfigService } from '@nestjs/config';
export declare class AiProviderService {
    private configService;
    private readonly logger;
    private apiKey;
    private baseURL;
    private model;
    constructor(configService: ConfigService);
    getModel(): string;
    private fetchAI;
    generateMarkdown(userPrompt: string): Promise<string>;
    generateJson(userPrompt: string): Promise<any>;
}
