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
const task_responses_service_1 = require("../task-responses/task-responses.service");
const tasks_service_1 = require("../tasks/tasks.service");
let TelegramService = TelegramService_1 = class TelegramService {
    configService;
    taskResponsesService;
    tasksService;
    logger = new common_1.Logger(TelegramService_1.name);
    botToken;
    constructor(configService, taskResponsesService, tasksService) {
        this.configService = configService;
        this.taskResponsesService = taskResponsesService;
        this.tasksService = tasksService;
        this.botToken = this.configService.get('TELEGRAM_BOT_TOKEN') || '';
    }
    async handleWebhook(update) {
        this.logger.log('Webhook received in service');
        if (update.callback_query) {
            const callbackQuery = update.callback_query;
            const data = callbackQuery.data;
            const chatId = callbackQuery.message?.chat?.id;
            const messageId = callbackQuery.message?.message_id;
            const queryId = callbackQuery.id;
            this.logger.log('========== CALLBACK QUERY DETAILS ==========');
            this.logger.log(`update.callback_query exists`);
            this.logger.log(`callback_query.data: ${data}`);
            this.logger.log(`callback_query.id: ${queryId}`);
            this.logger.log(`callback_query.message.message_id: ${messageId}`);
            this.logger.log(`callback_query.message.chat.id: ${chatId}`);
            this.logger.log('============================================');
            this.logger.log('Parsed callback_query');
            if (data && data.startsWith('action_')) {
                this.logger.log('Extracting action and taskId');
                const parts = data.split('_');
                const action = parts[1];
                const taskId = parts.slice(2).join('_');
                this.logger.log(`Action = ${action}`);
                this.logger.log(`TaskId = ${taskId}`);
                let userFeedbackText = 'Action recorded.';
                if (action === 'snooze') {
                    this.logger.log('Looking up Firestore document');
                    let task = null;
                    try {
                        task = await this.tasksService.findOne(taskId);
                        if (task) {
                            this.logger.log('Firestore document found');
                        }
                    }
                    catch (error) {
                        this.logger.error(`TasksService.findOne failed: ${error.message}`, error.stack);
                    }
                    if (task) {
                        const [hours, minutes] = task.startTime.split(':').map(Number);
                        let newDate = new Date();
                        newDate.setHours(hours, minutes + 15, 0, 0);
                        const newStartTime = new Intl.DateTimeFormat('en-GB', {
                            timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false
                        }).format(newDate).replace(/^24/, '00');
                        userFeedbackText = `Task snoozed until ${newStartTime}.`;
                        this.logger.log('Updating Firestore');
                        try {
                            await this.tasksService.update(taskId, { startTime: newStartTime });
                            this.logger.log('Firestore update success');
                        }
                        catch (error) {
                            this.logger.error(`TasksService.update failed: ${error.message}`, error.stack);
                        }
                    }
                }
                else if (action === 'completed' || action === 'missed') {
                    userFeedbackText = action === 'completed' ? '✅ Task Completed!' : '❌ Task Missed.';
                    const dateStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                    this.logger.log('Updating Firestore');
                    try {
                        await this.taskResponsesService.create({
                            taskId,
                            date: dateStr,
                            status: action,
                            reason: action === 'missed' ? 'User marked as missed via Telegram' : ''
                        });
                        this.logger.log('Firestore update success');
                    }
                    catch (error) {
                        this.logger.error(`TaskResponsesService.create failed: ${error.message}`, error.stack);
                    }
                }
                this.logger.log('Calling answerCallbackQuery');
                const answerSuccess = await this.answerCallbackQuery(queryId, userFeedbackText);
                if (answerSuccess) {
                    this.logger.log('answerCallbackQuery success');
                }
                if (chatId && messageId) {
                    this.logger.log('Calling editMessageText');
                    const originalText = callbackQuery.message?.text || 'Reminder';
                    const newText = `${originalText}\n\n*Status:* ${userFeedbackText}`;
                    const editSuccess = await this.editMessageText(chatId, messageId, newText);
                    if (editSuccess) {
                        this.logger.log('editMessageText success');
                    }
                }
                this.logger.log('Callback completed');
            }
        }
    }
    async answerCallbackQuery(callbackQueryId, text) {
        if (!this.botToken)
            return false;
        try {
            const url = `https://api.telegram.org/bot${this.botToken}/answerCallbackQuery`;
            const payload = { callback_query_id: callbackQueryId, text };
            this.logger.log(`answerCallbackQuery request: ${JSON.stringify(payload)}`);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            this.logger.log(`answerCallbackQuery response: ${JSON.stringify(data)}`);
            if (!data.ok) {
                throw new Error(`Telegram API Error: ${JSON.stringify(data)}`);
            }
            return true;
        }
        catch (error) {
            this.logger.error(`answerCallbackQuery failed: ${error.message}`, error.stack);
            return false;
        }
    }
    async editMessageText(chatId, messageId, text) {
        if (!this.botToken)
            return false;
        try {
            const url = `https://api.telegram.org/bot${this.botToken}/editMessageText`;
            const payload = { chat_id: chatId, message_id: messageId, text };
            this.logger.log(`editMessageText request: ${JSON.stringify(payload)}`);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            this.logger.log(`editMessageText response: ${JSON.stringify(data)}`);
            if (!data.ok) {
                throw new Error(`Telegram API Error: ${JSON.stringify(data)}`);
            }
            return true;
        }
        catch (error) {
            this.logger.error(`editMessageText failed: ${error.message}`, error.stack);
            return false;
        }
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
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!data.ok) {
                throw new Error(`Telegram API Error: ${JSON.stringify(data)}`);
            }
            else {
                this.logger.log(`Message successfully delivered. Message ID: ${data.result?.message_id}`);
            }
        }
        catch (error) {
            this.logger.error(`sendMessage failed: ${error.message}`, error.stack);
        }
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        task_responses_service_1.TaskResponsesService,
        tasks_service_1.TasksService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map