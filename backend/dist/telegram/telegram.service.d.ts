import { ConfigService } from '@nestjs/config';
export declare class TelegramService {
    private configService;
    private readonly logger;
    private readonly botToken;
    constructor(configService: ConfigService);
    handleWebhook(update: any): Promise<void>;
    sendMessage(chatId: string, text: string, replyMarkup?: any): Promise<void>;
}
