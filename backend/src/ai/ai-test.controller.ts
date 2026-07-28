import { Controller, Get, Logger } from '@nestjs/common';
import { AiProviderService } from './ai-provider.service';

/**
 * Temporary test controller to verify the OpenRouter AI pipeline end-to-end.
 * DELETE this file once verification is complete.
 */
@Controller('ai')
export class AiTestController {
  private readonly logger = new Logger(AiTestController.name);

  constructor(private readonly aiProvider: AiProviderService) {}

  @Get('test')
  async testPipeline(): Promise<string> {
    const userPrompt = 'Hello from Momentum AI.';

    this.logger.log('========== AI TEST ENDPOINT ==========');
    this.logger.log('Starting AI pipeline test...');

    // Log model and URL from env
    const model = process.env.AI_MODEL || 'openai/gpt-4o';
    const url = `${process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1'}/chat/completions`;
    this.logger.log(`Model: ${model}`);
    this.logger.log(`URL: ${url}`);
    this.logger.log(`User prompt: ${userPrompt}`);

    this.logger.log('Sending request to OpenRouter...');
    const startTime = Date.now();

    try {
      const response = await this.aiProvider.generateMarkdown(userPrompt);
      const elapsed = Date.now() - startTime;

      this.logger.log(`OpenRouter returned successfully`);
      this.logger.log(`Response time: ${elapsed}ms`);
      this.logger.log(`AI response (first 300 chars): ${response.substring(0, 300)}`);
      this.logger.log('========== AI TEST COMPLETE ==========');

      return response;
    } catch (error: any) {
      const elapsed = Date.now() - startTime;
      this.logger.error(`AI test failed after ${elapsed}ms: ${error.message}`);
      this.logger.error('========== AI TEST FAILED ==========');
      throw error;
    }
  }
}
