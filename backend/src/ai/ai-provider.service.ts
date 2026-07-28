import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SYSTEM_PROMPT } from './system-prompt';

/** Thrown when every model + every retry is exhausted on 429s */
class AiRateLimitError extends Error {
  constructor() {
    super('The AI service is temporarily busy. Please try again in a few moments.');
    this.name = 'AiRateLimitError';
  }
}

@Injectable()
export class AiProviderService {
  private readonly logger = new Logger(AiProviderService.name);
  private readonly apiKey: string;
  private readonly baseURL: string;
  private readonly primaryModel: string;
  private readonly models: string[];

  /** Retry config */
  private readonly MAX_RETRIES = 3;
  private readonly BASE_DELAY_MS = 2000; // 2s → 4s → 8s

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('AI_API_KEY') || '';

    this.logger.log('AI Provider: OpenRouter');
    this.logger.log('Environment Variable: AI_API_KEY');
    this.logger.log(`API Key Exists: ${!!this.apiKey}`);

    if (this.apiKey) {
      this.logger.log(`Key Length: ${this.apiKey.length}`);
      if (this.apiKey.length >= 8) {
        const preview = `${this.apiKey.substring(0, 4)}${'*'.repeat(this.apiKey.length - 8)}${this.apiKey.substring(this.apiKey.length - 4)}`;
        this.logger.log(`Preview: ${preview}`);
      }
      this.logger.log('AI Provider initialized successfully.');

      this.baseURL = this.configService.get<string>('AI_BASE_URL', 'https://openrouter.ai/api/v1');
      this.primaryModel = this.configService.get<string>('AI_MODEL', 'openai/gpt-4o');

      // Build ordered model list: AI_MODELS (if set) takes priority, otherwise just AI_MODEL
      const modelsEnv = this.configService.get<string>('AI_MODELS', '');
      if (modelsEnv && modelsEnv.trim().length > 0) {
        this.models = modelsEnv
          .split(',')
          .map((m) => m.trim())
          .filter((m) => m.length > 0);
        this.logger.log(`Fallback models loaded (${this.models.length}): ${this.models.join(', ')}`);
      } else {
        this.models = [this.primaryModel];
        this.logger.log(`Single model mode: ${this.primaryModel}`);
      }
    } else {
      this.logger.error('AI Provider initialization failed: Missing AI_API_KEY.');
      throw new Error('AI Provider initialization failed: Missing AI_API_KEY.');
    }
  }

  /** Expose primary model name for logging in controllers */
  getModel(): string {
    return this.primaryModel;
  }

  // ───────────────────────────────────────────────
  // Core fetch — single attempt, single model
  // ───────────────────────────────────────────────

  /**
   * Makes a single HTTP call to OpenRouter.
   * Returns { status, data, raw } so the caller can inspect the status code.
   */
  private async fetchOnce(
    model: string,
    payload: any,
  ): Promise<{ status: number; data: any; raw: string }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    const url = `${this.baseURL}/chat/completions`;

    const requestBody = {
      model,
      temperature: 0.7,
      max_tokens: 2048,
      ...payload,
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Momentum AI',
    };

    const headersForLog = { ...headers, Authorization: 'Bearer [REDACTED]' };

    this.logger.log('========== AI REQUEST ==========');
    this.logger.log(`URL: ${url}`);
    this.logger.log(`Model: ${model}`);
    this.logger.log(`Headers: ${JSON.stringify(headersForLog)}`);
    this.logger.log('================================');

    try {
      this.logger.log(`Calling OpenRouter (${model})...`);
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const raw = await response.text();

      let data: any;
      try {
        data = JSON.parse(raw);
      } catch {
        data = null;
      }

      this.logger.log('========== AI RESPONSE ==========');
      this.logger.log(`Status: ${response.status} ${response.statusText}`);
      this.logger.log(`Model: ${model}`);
      if (data) {
        this.logger.log(`Parsed JSON: ${JSON.stringify(data)}`);
      } else {
        this.logger.log(`Raw (unparseable): ${raw}`);
      }
      this.logger.log('=================================');

      return { status: response.status, data, raw };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        this.logger.error(`OpenRouter timeout for model ${model} (30 000 ms)`);
        throw new Error('OpenRouter API Timeout');
      }
      throw error;
    }
  }

  // ───────────────────────────────────────────────
  // Retry + fallback orchestrator
  // ───────────────────────────────────────────────

  /**
   * Tries each model in `this.models` in order.
   * For each model, retries up to MAX_RETRIES on 429 with exponential backoff.
   * On any non-429 error, throws immediately (no retry).
   * If every model exhausts all retries, throws AiRateLimitError.
   */
  private async fetchAI(payload: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('AI Provider is not configured (Missing API Key)');
    }

    for (let modelIdx = 0; modelIdx < this.models.length; modelIdx++) {
      const model = this.models[modelIdx];
      const isLastModel = modelIdx === this.models.length - 1;

      this.logger.log(
        `[Fallback] Trying model ${modelIdx + 1}/${this.models.length}: ${model}`,
      );

      for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
        // Exponential backoff wait (skip on first attempt)
        if (attempt > 0) {
          const delayMs = this.BASE_DELAY_MS * Math.pow(2, attempt - 1); // 2s, 4s, 8s
          this.logger.warn(
            `[Retry] Model: ${model} | Retry ${attempt}/${this.MAX_RETRIES} | Waiting ${delayMs}ms...`,
          );
          await this.sleep(delayMs);
        }

        const { status, data, raw } = await this.fetchOnce(model, payload);

        // ── Success ──
        if (status >= 200 && status < 300) {
          if (!data?.choices || data.choices.length === 0) {
            throw new Error('Empty response from OpenRouter API');
          }
          if (attempt > 0) {
            this.logger.log(
              `[Retry] Succeeded on retry ${attempt} for model ${model}`,
            );
          }
          return data;
        }

        // ── Rate limited (429) ──
        if (status === 429) {
          const errorMsg =
            data?.error?.message || 'Rate limited (429)';
          this.logger.warn(
            `[Rate Limit] Model: ${model} | Attempt: ${attempt + 1}/${this.MAX_RETRIES + 1} | Status: ${status} | Response: ${errorMsg}`,
          );

          // If this was the last retry for this model, move to next model
          if (attempt === this.MAX_RETRIES) {
            this.logger.warn(
              `[Fallback] All ${this.MAX_RETRIES} retries exhausted for model: ${model}`,
            );
            if (!isLastModel) {
              this.logger.log(
                `[Fallback] Switching to next model: ${this.models[modelIdx + 1]}`,
              );
            }
            break; // exit retry loop → next model
          }
          // otherwise continue to next retry attempt
          continue;
        }

        // ── Any other error (400, 401, 402, 500…) — fail immediately ──
        const errorData = data || { error: { message: `HTTP ${status}` } };
        const errorMessage = errorData.error?.message || `HTTP ${status}`;
        this.logger.error(
          `OpenRouter API Error (${status}): ${errorMessage}`,
        );
        this.logger.error(
          `OpenRouter Error Body: ${JSON.stringify(errorData)}`,
        );
        throw new Error(
          `OpenRouter API Error: ${status} - ${errorMessage} - Raw: ${raw}`,
        );
      }
    }

    // Every model × every retry exhausted on 429s
    this.logger.error(
      `[Rate Limit] All models exhausted. Models tried: ${this.models.join(', ')}`,
    );
    throw new AiRateLimitError();
  }

  // ───────────────────────────────────────────────
  // Public API (unchanged signatures)
  // ───────────────────────────────────────────────

  async generateMarkdown(userPrompt: string): Promise<string> {
    const data = await this.fetchAI({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
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

  async generateJson(userPrompt: string): Promise<any> {
    const data = await this.fetchAI({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    });

    const content = data.choices[0].message?.content;
    if (!content) return {};

    try {
      return JSON.parse(content);
    } catch (e) {
      this.logger.error('Failed to parse JSON response from OpenRouter');
      return {};
    }
  }

  // ───────────────────────────────────────────────
  // Helpers
  // ───────────────────────────────────────────────

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
