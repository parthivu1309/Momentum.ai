import { ConfigService } from '@nestjs/config';
export declare class AiProviderService {
    private configService;
    private readonly logger;
    private apiKey;
    private baseURL;
    private model;
    constructor(configService: ConfigService);
    private fetchGrok;
    generateMarkdown(systemPrompt: string, userPrompt: string): Promise<string>;
    generateJson(systemPrompt: string, userPrompt: string): Promise<any>;
}
