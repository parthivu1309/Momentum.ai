import { AiProviderService } from './ai-provider.service';
export declare class AiTestController {
    private readonly aiProvider;
    private readonly logger;
    constructor(aiProvider: AiProviderService);
    testPipeline(): Promise<string>;
}
