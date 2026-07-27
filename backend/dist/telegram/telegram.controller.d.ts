import { TelegramService } from './telegram.service';
import type { Request } from 'express';
export declare class TelegramController {
    private readonly telegramService;
    private readonly logger;
    constructor(telegramService: TelegramService);
    handleWebhook(req: Request): {
        ok: boolean;
    };
}
