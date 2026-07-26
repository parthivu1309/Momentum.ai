import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TaskResponsesService } from '../task-responses/task-responses.service';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;

  constructor(
    private configService: ConfigService,
    private taskResponsesService: TaskResponsesService,
    private tasksService: TasksService
  ) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN') || '';
  }

  async handleWebhook(update: any) {
    this.logger.log('Received Telegram update: ' + JSON.stringify(update));
    
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const data = callbackQuery.data; 
      const chatId = callbackQuery.message?.chat?.id;
      const messageId = callbackQuery.message?.message_id;
      const queryId = callbackQuery.id;
      
      this.logger.log(`Parsed callback_query. Data: ${data}`);

      if (data && data.startsWith('action_')) {
        const parts = data.split('_');
        const action = parts[1]; 
        const taskId = parts.slice(2).join('_'); 

        let userFeedbackText = 'Action recorded.';
        
        try {
          if (action === 'snooze') {
             const task = await this.tasksService.findOne(taskId);
             if (task) {
                const [hours, minutes] = task.startTime.split(':').map(Number);
                let newDate = new Date();
                newDate.setHours(hours, minutes + 15, 0, 0);
                
                const newStartTime = new Intl.DateTimeFormat('en-GB', { 
                  timeZone: 'Asia/Kolkata', 
                  hour: '2-digit', minute: '2-digit', hour12: false 
                }).format(newDate).replace(/^24/, '00');

                await this.tasksService.update(taskId, { startTime: newStartTime });
                userFeedbackText = `Task snoozed until ${newStartTime}.`;
             }
          } else if (action === 'completed' || action === 'missed') {
             const dateStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
             await this.taskResponsesService.create({
               taskId,
               date: dateStr,
               status: action,
               reason: action === 'missed' ? 'User marked as missed via Telegram' : ''
             });
             userFeedbackText = action === 'completed' ? '✅ Task Completed!' : '❌ Task Missed.';
          }

          await this.answerCallbackQuery(queryId, userFeedbackText);

          if (chatId && messageId) {
             const originalText = callbackQuery.message?.text || 'Reminder';
             const newText = `${originalText}\n\n*Status:* ${userFeedbackText}`;
             await this.editMessageText(chatId, messageId, newText);
          }
        } catch (err: any) {
           this.logger.error(`Error processing callback query: ${err.message}`, err.stack);
           await this.answerCallbackQuery(queryId, 'An error occurred.');
        }
      }
    }
  }

  async answerCallbackQuery(callbackQueryId: string, text?: string) {
     if (!this.botToken) return;
     try {
       const url = `https://api.telegram.org/bot${this.botToken}/answerCallbackQuery`;
       await fetch(url, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ callback_query_id: callbackQueryId, text })
       });
     } catch (e) {
       this.logger.error('Failed to answer callback query', e);
     }
  }

  async editMessageText(chatId: string | number, messageId: number, text: string) {
     if (!this.botToken) return;
     try {
       const url = `https://api.telegram.org/bot${this.botToken}/editMessageText`;
       await fetch(url, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ chat_id: chatId, message_id: messageId, text })
       });
     } catch (e) {
       this.logger.error('Failed to edit message text', e);
     }
  }

  async sendMessage(chatId: string, text: string, replyMarkup?: any) {
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
      } else {
        this.logger.log(`Message successfully delivered. Message ID: ${data.result?.message_id}`);
      }
    } catch (error: any) {
      this.logger.error(`Exception occurred while sending Telegram message: ${error.message}`, error.stack);
    }
  }
}
