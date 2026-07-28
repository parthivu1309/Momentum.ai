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
let AiProviderService = AiProviderService_1 = class AiProviderService {
    configService;
    logger = new common_1.Logger(AiProviderService_1.name);
    apiKey;
    baseURL;
    model;
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
            this.model = this.configService.get('AI_MODEL', 'openai/gpt-4o');
        }
        else {
            this.logger.error('AI Provider initialization failed: Missing AI_API_KEY.');
            throw new Error('AI Provider initialization failed: Missing AI_API_KEY.');
        }
    }
    getModel() {
        return this.model;
    }
    async fetchAI(payload) {
        if (!this.apiKey) {
            throw new Error('AI Provider is not configured (Missing API Key)');
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        const url = `${this.baseURL}/chat/completions`;
        const requestBody = {
            model: this.model,
            temperature: 0.7,
            max_tokens: 2048,
            ...payload
        };
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Momentum AI'
        };
        const headersForLog = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer [REDACTED]',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Momentum AI'
        };
        this.logger.log('========== AI REQUEST ==========');
        this.logger.log(`URL: ${url}`);
        this.logger.log(`Model: ${this.model}`);
        this.logger.log(`Headers: ${JSON.stringify(headersForLog)}`);
        this.logger.log(`Request body: ${JSON.stringify(requestBody)}`);
        this.logger.log('================================');
        try {
            this.logger.log(`Calling OpenRouter (${this.model})...`);
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            this.logger.log('OpenRouter response received');
            const responseHeaders = {};
            response.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });
            const rawResponseText = await response.text();
            this.logger.log('========== AI RESPONSE ==========');
            this.logger.log(`Status code: ${response.status} ${response.statusText}`);
            this.logger.log(`Headers: ${JSON.stringify(responseHeaders)}`);
            this.logger.log(`Raw response text: ${rawResponseText}`);
            let data;
            try {
                data = JSON.parse(rawResponseText);
                this.logger.log(`Parsed JSON: ${JSON.stringify(data)}`);
            }
            catch (parseError) {
                this.logger.log('Failed to parse response as JSON');
            }
            this.logger.log('=================================');
            if (!response.ok) {
                let errorData = data || { error: { message: response.statusText } };
                const errorMessage = errorData.error?.message || response.statusText;
                this.logger.error(`OpenRouter API Error (${response.status}): ${errorMessage}`);
                this.logger.error(`OpenRouter Error Body: ${JSON.stringify(errorData)}`);
                throw new Error(`OpenRouter API Error: ${response.status} - ${errorMessage} - Raw: ${rawResponseText}`);
            }
            if (!data.choices || data.choices.length === 0) {
                throw new Error('Empty response from OpenRouter API');
            }
            return data;
        }
        catch (error) {
            if (error.name === 'AbortError') {
                this.logger.error('OpenRouter API Error: Timeout (30000ms exceeded)');
                throw new Error('OpenRouter API Timeout');
            }
            this.logger.error('========== AI ERROR ==========');
            this.logger.error(`Original Error: ${error.message}`);
            if (error.stack) {
                this.logger.error(`Stack: ${error.stack}`);
            }
            this.logger.error('==============================');
            throw error;
        }
    }
    async generateMarkdown(userPrompt) {
        const data = await this.fetchAI({
            messages: [
                { role: 'system', content: system_prompt_1.SYSTEM_PROMPT },
                { role: 'user', content: userPrompt }
            ]
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
                { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' }
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
};
exports.AiProviderService = AiProviderService;
exports.AiProviderService = AiProviderService = AiProviderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiProviderService);
//# sourceMappingURL=ai-provider.service.js.map