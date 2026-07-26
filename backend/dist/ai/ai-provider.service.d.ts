import { ConfigService } from '@nestjs/config';
export declare class AiProviderService {
    private configService;
    private readonly logger;
    private openai;
    private model;
    constructor(configService: ConfigService);
    generateMarkdown(systemPrompt: string, userPrompt: string): Promise<string>;
    generateJson(systemPrompt: string, userPrompt: string): Promise<any>;
}
