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
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let TelegramService = TelegramService_1 = class TelegramService {
    configService;
    logger = new common_1.Logger(TelegramService_1.name);
    botToken;
    constructor(configService) {
        this.configService = configService;
        this.botToken = this.configService.get('TELEGRAM_BOT_TOKEN') || '';
    }
    async handleWebhook(update) {
        this.logger.log('Received Telegram update: ' + JSON.stringify(update));
    }
    async sendMessage(chatId, text, replyMarkup) {
        this.logger.log(`Preparing to send message to chatId: ${chatId}`);
        if (!this.botToken) {
            this.logger.error('TELEGRAM_BOT_TOKEN not set in environment. Cannot send message.');
            return;
        }
        if (!chatId) {
            this.logger.error('TELEGRAM_CHAT_ID is missing or undefined. Cannot send message.');
            return;
        }
        try {
            const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
            const payload = {
                chat_id: chatId,
                text,
                reply_markup: replyMarkup
            };
            this.logger.log(`Sending HTTP POST to Telegram API: ${url.replace(this.botToken, '***')}`);
            this.logger.debug(`Payload: ${JSON.stringify(payload)}`);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            this.logger.log(`Received HTTP Status ${response.status} from Telegram API`);
            const data = await response.json();
            if (!data.ok) {
                this.logger.error(`Telegram API returned an error: ${JSON.stringify(data)}`);
            }
            else {
                this.logger.log(`Message successfully delivered. Message ID: ${data.result?.message_id}`);
            }
        }
        catch (error) {
            this.logger.error(`Exception occurred while sending Telegram message: ${error.message}`, error.stack);
        }
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map