import { ConfigService } from '@nestjs/config';
import { TaskResponsesService } from '../task-responses/task-responses.service';
import { TasksService } from '../tasks/tasks.service';
export declare class TelegramService {
    private configService;
    private taskResponsesService;
    private tasksService;
    private readonly logger;
    private readonly botToken;
    constructor(configService: ConfigService, taskResponsesService: TaskResponsesService, tasksService: TasksService);
    handleWebhook(update: any): Promise<void>;
    answerCallbackQuery(callbackQueryId: string, text?: string): Promise<boolean>;
    editMessageText(chatId: string | number, messageId: number, text: string): Promise<boolean>;
    sendMessage(chatId: string, text: string, replyMarkup?: any): Promise<void>;
}
