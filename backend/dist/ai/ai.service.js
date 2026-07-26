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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const genai_1 = require("@google/genai");
let AiService = AiService_1 = class AiService {
    configService;
    ai = null;
    logger = new common_1.Logger(AiService_1.name);
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (apiKey) {
            this.ai = new genai_1.GoogleGenAI({ apiKey });
        }
        else {
            this.logger.warn('GEMINI_API_KEY is not set. AI features will be disabled.');
        }
    }
    async generateDailyCoaching(analyticsData) {
        if (!this.ai)
            return { error: 'AI not configured' };
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
            if (!response.text)
                return { error: 'Empty response' };
            return JSON.parse(response.text);
        }
        catch (error) {
            this.logger.error('Failed to generate AI coaching', error);
            return { error: 'Failed to generate coaching' };
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map