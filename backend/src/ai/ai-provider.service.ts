import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiProviderService {
  private readonly logger = new Logger(AiProviderService.name);
  private apiKey: string;
  private baseURL: string;
  private model: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GROK_API_KEY') || '';
    
    this.logger.log('AI Provider: Grok');
    this.logger.log('Environment Variable: GROK_API_KEY');
    this.logger.log(`API Key Exists: ${!!this.apiKey}`);
    
    if (this.apiKey) {
      this.logger.log(`Key Length: ${this.apiKey.length}`);
      if (this.apiKey.length >= 8) {
        const preview = `${this.apiKey.substring(0, 4)}${'*'.repeat(this.apiKey.length - 8)}${this.apiKey.substring(this.apiKey.length - 4)}`;
        this.logger.log(`Preview: ${preview}`);
      }
      this.logger.log('AI Provider initialized successfully.');

      this.baseURL = this.configService.get<string>('GROK_BASE_URL', 'https://api.x.ai/v1');
      this.model = this.configService.get<string>('GROK_MODEL', 'grok-2-latest');
    } else {
      this.logger.error('AI Provider initialization failed: Missing GROK_API_KEY.');
      throw new Error('AI Provider initialization failed: Missing GROK_API_KEY.');
    }
  }

  private async fetchGrok(payload: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('AI Provider is not configured (Missing API Key)');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

    try {
      this.logger.log(`Calling Grok (${this.model})...`);
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          temperature: 0.7,
          ...payload
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      this.logger.log('Grok response received');

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: { message: response.statusText } };
        }

        const errorMessage = errorData.error?.message || response.statusText;
        
        switch (response.status) {
          case 401:
            this.logger.error(`Grok API Error: Authentication failure (401)`);
            break;
          case 402:
            this.logger.error(`Grok API Error: Quota exceeded / Insufficient Balance (402)`);
            break;
          case 403:
            this.logger.error(`Grok API Error: Permission Denied / Insufficient Balance (403) - ${errorMessage}`);
            break;
          case 429:
            this.logger.error(`Grok API Error: Rate limits (429)`);
            break;
          case 400:
            this.logger.error(`Grok API Error: Invalid Request (400) - ${errorMessage}`);
            this.logger.error(`Grok API Error Details: ${JSON.stringify(errorData)}`);
            break;
          case 404:
            this.logger.error(`Grok API Error: Invalid model or endpoint (404) - ${errorMessage}`);
            break;
          default:
            this.logger.error(`Grok API Error: Service unavailable / Network failure (${response.status}) - ${errorMessage}`);
        }
        
        throw new Error(`Grok API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('Empty response from Grok API');
      }

      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        this.logger.error('Grok API Error: Timeout (30000ms exceeded)');
        throw new Error('Grok API Timeout');
      }
      this.logger.error(`Grok API Error: ${error.message}`);
      if (error.stack) {
        this.logger.error(error.stack);
      }
      throw new Error('Failed to generate AI report');
    }
  }

  async generateMarkdown(systemPrompt: string, userPrompt: string): Promise<string> {
    const data = await this.fetchGrok({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });

    let content = data.choices[0].message?.content || '';
    
    // Strip markdown code block wrappers if any
    if (content.startsWith('```markdown')) {
      content = content.replace(/^```markdown\n/, '').replace(/\n```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    return content;
  }

  async generateJson(systemPrompt: string, userPrompt: string): Promise<any> {
    const data = await this.fetchGrok({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' }
    });

    const content = data.choices[0].message?.content;
    if (!content) return {};

    try {
      return JSON.parse(content);
    } catch (e) {
      this.logger.error('Failed to parse JSON response from Grok');
      return {};
    }
  }
}
