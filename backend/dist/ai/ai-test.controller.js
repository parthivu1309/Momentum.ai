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
var AiTestController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiTestController = void 0;
const common_1 = require("@nestjs/common");
const ai_provider_service_1 = require("./ai-provider.service");
let AiTestController = AiTestController_1 = class AiTestController {
    aiProvider;
    logger = new common_1.Logger(AiTestController_1.name);
    constructor(aiProvider) {
        this.aiProvider = aiProvider;
    }
    async testPipeline() {
        const userPrompt = 'Hello from Momentum AI.';
        this.logger.log('========== AI TEST ENDPOINT ==========');
        this.logger.log('Starting AI pipeline test...');
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
        }
        catch (error) {
            const elapsed = Date.now() - startTime;
            this.logger.error(`AI test failed after ${elapsed}ms: ${error.message}`);
            this.logger.error('========== AI TEST FAILED ==========');
            throw error;
        }
    }
};
exports.AiTestController = AiTestController;
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiTestController.prototype, "testPipeline", null);
exports.AiTestController = AiTestController = AiTestController_1 = __decorate([
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_provider_service_1.AiProviderService])
], AiTestController);
//# sourceMappingURL=ai-test.controller.js.map