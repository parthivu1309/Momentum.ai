import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private ai: GoogleGenAI | null = null;
  private readonly logger = new Logger(AiService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      this.logger.warn('GEMINI_API_KEY is not set. AI features will be disabled.');
    }
  }

  async generateDailyCoaching(analyticsData: any): Promise<any> {
    if (!this.ai) return { error: 'AI not configured' };

    const prompt = `
You are Momentum.AI, a tough but fair discipline coach.
Based on the following daily analytics, generate a structured coaching response.
Analytics:
${JSON.stringify(analyticsData, null, 2)}

Return a JSON object with:
- summary: string (a short punchy summary of the day)
- biggestAchievement: string
- biggestWeakness: string
- recommendation: string
- motivation: string
`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      if (!response.text) return { error: 'Empty response' };
      return JSON.parse(response.text);
    } catch (error) {
      this.logger.error('Failed to generate AI coaching', error);
      return { error: 'Failed to generate coaching' };
    }
  }
}
