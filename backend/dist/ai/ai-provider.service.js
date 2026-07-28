"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiProviderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const system_prompt_1 = require("./system-prompt");
class AiRateLimitError extends Error {
    constructor() {
        super('The AI service is temporarily busy. Please try again in a few moments.');
        this.name = 'AiRateLimitError';
    }
}
let AiProviderService = AiProviderService_1 = class AiProviderService {
    configService;
    logger = new common_1.Logger(AiProviderService_1.name);
    apiKey;
    baseURL;
    primaryModel;
    models;
    MAX_RETRIES = 3;
    BASE_DELAY_MS = 2000;
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('AI_API_KEY') || '';
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
            this.baseURL = this.configService.get('AI_BASE_URL', 'https://openrouter.ai/api/v1');
            this.primaryModel = this.configService.get('AI_MODEL', 'openai/gpt-4o');
            const modelsEnv = this.configService.get('AI_MODELS', '');
            if (modelsEnv && modelsEnv.trim().length > 0) {
                this.models = modelsEnv
                    .split(',')
                    .map((m) => m.trim())
                    .filter((m) => m.length > 0);
                this.logger.log(`Fallback models loaded (${this.models.length}): ${this.models.join(', ')}`);
            }
            else {
                this.models = [this.primaryModel];
                this.logger.log(`Single model mode: ${this.primaryModel}`);
            }
        }
        else {
            this.logger.error('AI Provider initialization failed: Missing AI_API_KEY.');
            throw new Error('AI Provider initialization failed: Missing AI_API_KEY.');
        }
    }
    getModel() {
        return this.primaryModel;
    }
    async fetchOnce(model, payload) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        const url = `${this.baseURL}/chat/completions`;
        const requestBody = {
            model,
            temperature: 0.7,
            max_tokens: 2048,
            ...payload,
        };
        const headers = {
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
            let data;
            try {
                data = JSON.parse(raw);
            }
            catch {
                data = null;
            }
            this.logger.log('========== AI RESPONSE ==========');
            this.logger.log(`Status: ${response.status} ${response.statusText}`);
            this.logger.log(`Model: ${model}`);
            if (data) {
                this.logger.log(`Parsed JSON: ${JSON.stringify(data)}`);
            }
            else {
                this.logger.log(`Raw (unparseable): ${raw}`);
            }
            this.logger.log('=================================');
            return { status: response.status, data, raw };
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                this.logger.error(`OpenRouter timeout for model ${model} (30 000 ms)`);
                throw new Error('OpenRouter API Timeout');
            }
            throw error;
        }
    }
    async fetchAI(payload) {
        if (!this.apiKey) {
            throw new Error('AI Provider is not configured (Missing API Key)');
        }
        for (let modelIdx = 0; modelIdx < this.models.length; modelIdx++) {
            const model = this.models[modelIdx];
            const isLastModel = modelIdx === this.models.length - 1;
            this.logger.log(`[Fallback] Trying model ${modelIdx + 1}/${this.models.length}: ${model}`);
            for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
                if (attempt > 0) {
                    const delayMs = this.BASE_DELAY_MS * Math.pow(2, attempt - 1);
                    this.logger.warn(`[Retry] Model: ${model} | Retry ${attempt}/${this.MAX_RETRIES} | Waiting ${delayMs}ms...`);
                    await this.sleep(delayMs);
                }
                const { status, data, raw } = await this.fetchOnce(model, payload);
                if (status >= 200 && status < 300) {
                    if (!data?.choices || data.choices.length === 0) {
                        throw new Error('Empty response from OpenRouter API');
                    }
                    if (attempt > 0) {
                        this.logger.log(`[Retry] Succeeded on retry ${attempt} for model ${model}`);
                    }
                    return data;
                }
                if (status === 429) {
                    const errorMsg = data?.error?.message || 'Rate limited (429)';
                    this.logger.warn(`[Rate Limit] Model: ${model} | Attempt: ${attempt + 1}/${this.MAX_RETRIES + 1} | Status: ${status} | Response: ${errorMsg}`);
                    if (attempt === this.MAX_RETRIES) {
                        this.logger.warn(`[Fallback] All ${this.MAX_RETRIES} retries exhausted for model: ${model}`);
                        if (!isLastModel) {
                            this.logger.log(`[Fallback] Switching to next model: ${this.models[modelIdx + 1]}`);
                        }
                        break;
                    }
                    continue;
                }
                const errorData = data || { error: { message: `HTTP ${status}` } };
                const errorMessage = errorData.error?.message || `HTTP ${status}`;
                this.logger.error(`OpenRouter API Error (${status}): ${errorMessage}`);
                this.logger.error(`OpenRouter Error Body: ${JSON.stringify(errorData)}`);
                throw new Error(`OpenRouter API Error: ${status} - ${errorMessage} - Raw: ${raw}`);
            }
        }
        this.logger.error(`[Rate Limit] All models exhausted. Models tried: ${this.models.join(', ')}`);
        throw new AiRateLimitError();
    }
    async generateMarkdown(userPrompt) {
        const data = await this.fetchAI({
            messages: [
                { role: 'system', content: system_prompt_1.SYSTEM_PROMPT },
                { role: 'user', content: userPrompt },
            ],
        });
        let content = data.choices[0].message?.content || '';
        if (content.startsWith('```markdown')) {
            content = content.replace(/^```markdown\n/, '').replace(/\n```$/, '');
        }
        else if (content.startsWith('```')) {
            content = content.replace(/^```\n/, '').replace(/\n```$/, '');
        }
        return content;
    }
    async generateJson(userPrompt) {
        const data = await this.fetchAI({
            messages: [
                { role: 'system', content: system_prompt_1.SYSTEM_PROMPT },
                { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
        });
        const content = data.choices[0].message?.content;
        if (!content)
            return {};
        try {
            return JSON.parse(content);
        }
        catch (e) {
            this.logger.error('Failed to parse JSON response from OpenRouter');
            return {};
        }
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.AiProviderService = AiProviderService;
exports.AiProviderService = AiProviderService = AiProviderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiProviderService);
//# sourceMappingURL=ai-provider.service.js.map