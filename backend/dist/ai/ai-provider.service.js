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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AiProviderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
let AiProviderService = AiProviderService_1 = class AiProviderService {
    configService;
    logger = new common_1.Logger(AiProviderService_1.name);
    openai = null;
    model = 'deepseek-chat';
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('DEEPSEEK_API_KEY');
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
            const baseURL = this.configService.get('DEEPSEEK_BASE_URL', 'https://api.deepseek.com');
            const model = this.configService.get('DEEPSEEK_MODEL', 'deepseek-chat');
            this.openai = new openai_1.default({
                apiKey,
                baseURL,
                timeout: 30000,
                maxRetries: 3,
            });
            this.model = model;
        }
        else {
            this.logger.error('AI Provider initialization failed: Missing DEEPSEEK_API_KEY.');
            throw new Error('AI Provider initialization failed: Missing DEEPSEEK_API_KEY.');
        }
    }
    async generateMarkdown(systemPrompt, userPrompt) {
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
            if (content.startsWith('```markdown')) {
                content = content.replace(/^```markdown\n/, '').replace(/\n```$/, '');
            }
            else if (content.startsWith('```')) {
                content = content.replace(/^```\n/, '').replace(/\n```$/, '');
            }
            return content;
        }
        catch (error) {
            this.logger.error(`DeepSeek API Error: ${error.message}`);
            if (error.response) {
                this.logger.error(`HTTP Status: ${error.status}`);
                this.logger.error(`Response Body: ${JSON.stringify(error.response?.data)}`);
            }
            this.logger.error(error.stack);
            throw new Error('Failed to generate AI report');
        }
    }
    async generateJson(systemPrompt, userPrompt) {
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
            if (!content)
                return {};
            return JSON.parse(content);
        }
        catch (error) {
            this.logger.error(`DeepSeek API Error: ${error.message}`);
            if (error.response) {
                this.logger.error(`HTTP Status: ${error.status}`);
                this.logger.error(`Response Body: ${JSON.stringify(error.response?.data)}`);
            }
            this.logger.error(error.stack);
            throw new Error('Failed to generate AI coaching');
        }
    }
};
exports.AiProviderService = AiProviderService;
exports.AiProviderService = AiProviderService = AiProviderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiProviderService);
//# sourceMappingURL=ai-provider.service.js.map