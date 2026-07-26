import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiProviderService {
  private readonly logger = new Logger(AiProviderService.name);
  private openai: OpenAI | null = null;
  private model: string = 'deepseek-chat';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');
    
    this.logger.log('AI Provider: DeepSeek');
    this.logger.log('Environment Variable Name: DEEPSEEK_API_KEY');
    this.logger.log(`API Key Exists: ${!!apiKey}`);
    
    if (apiKey) {
      this.logger.log(`Key Length: ${apiKey.length}`);
      if (apiKey.length >= 8) {
        const preview = `${apiKey.substring(0, 4)}${'*'.repeat(apiKey.length - 8)}${apiKey.substring(apiKey.length - 4)}`;
        this.logger.log(`Preview: ${preview}`);
      }
      this.logger.log('AI Provider initialized successfully.');

      const baseURL = this.configService.get<string>('DEEPSEEK_BASE_URL', 'https://api.deepseek.com');
      const model = this.configService.get<string>('DEEPSEEK_MODEL', 'deepseek-chat');
      
      this.openai = new OpenAI({
        apiKey,
        baseURL,
        timeout: 30000, // 30 seconds
        maxRetries: 3, // Auto-retry for rate limits / network errors
      });
      this.model = model;
    } else {
      this.logger.error('AI Provider initialization failed: Missing DEEPSEEK_API_KEY.');
      throw new Error('AI Provider initialization failed: Missing DEEPSEEK_API_KEY.');
    }
  }

  async generateMarkdown(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.openai) {
      throw new Error('AI Provider is not configured (Missing API Key)');
    }

    try {
      this.logger.log(`Calling DeepSeek (${this.model})...`);
      
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      });

      this.logger.log('DeepSeek response received');

      if (!response.choices || response.choices.length === 0) {
        throw new Error('Empty response from DeepSeek API');
      }

      let content = response.choices[0].message?.content || '';
      
      // Strip markdown code block wrappers if any
      if (content.startsWith('```markdown')) {
        content = content.replace(/^```markdown\n/, '').replace(/\n```$/, '');
      } else if (content.startsWith('```')) {
        content = content.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      return content;
    } catch (error: any) {
      this.logger.error(`DeepSeek API Error: ${error.message}`);
      if (error.response) {
         this.logger.error(`HTTP Status: ${error.status}`);
         this.logger.error(`Response Body: ${JSON.stringify(error.response?.data)}`);
      }
      this.logger.error(error.stack);
      throw new Error('Failed to generate AI report');
    }
  }

  async generateJson(systemPrompt: string, userPrompt: string): Promise<any> {
    if (!this.openai) {
      throw new Error('AI Provider is not configured (Missing API Key)');
    }

    try {
      this.logger.log(`Calling DeepSeek (${this.model}) for JSON...`);
      
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      this.logger.log('DeepSeek response received');

      if (!response.choices || response.choices.length === 0) {
        throw new Error('Empty response from DeepSeek API');
      }

      const content = response.choices[0].message?.content;
      if (!content) return {};

      return JSON.parse(content);
    } catch (error: any) {
      this.logger.error(`DeepSeek API Error: ${error.message}`);
      if (error.response) {
         this.logger.error(`HTTP Status: ${error.status}`);
         this.logger.error(`Response Body: ${JSON.stringify(error.response?.data)}`);
      }
      this.logger.error(error.stack);
      throw new Error('Failed to generate AI coaching');
    }
  }
}
