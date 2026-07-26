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
    this.logger.log('Webhook received');
    
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const data = callbackQuery.data; 
      const chatId = callbackQuery.message?.chat?.id;
      const messageId = callbackQuery.message?.message_id;
      const queryId = callbackQuery.id;
      
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
           let task: any = null;
           try {
             task = await this.tasksService.findOne(taskId);
             if (task) {
               this.logger.log('Firestore document found');
             }
           } catch (error: any) {
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
              } catch (error: any) {
                this.logger.error(`TasksService.update failed: ${error.message}`, error.stack);
              }
           }
        } else if (action === 'completed' || action === 'missed') {
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
           } catch (error: any) {
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

  async answerCallbackQuery(callbackQueryId: string, text?: string): Promise<boolean> {
     if (!this.botToken) return false;
     try {
       const url = `https://api.telegram.org/bot${this.botToken}/answerCallbackQuery`;
       const response = await fetch(url, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ callback_query_id: callbackQueryId, text })
       });
       const data = await response.json();
       if (!data.ok) {
          throw new Error(`Telegram API Error: ${JSON.stringify(data)}`);
       }
       return true;
     } catch (error: any) {
       this.logger.error(`answerCallbackQuery failed: ${error.message}`, error.stack);
       return false;
     }
  }

  async editMessageText(chatId: string | number, messageId: number, text: string): Promise<boolean> {
     if (!this.botToken) return false;
     try {
       const url = `https://api.telegram.org/bot${this.botToken}/editMessageText`;
       const response = await fetch(url, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ chat_id: chatId, message_id: messageId, text })
       });
       const data = await response.json();
       if (!data.ok) {
          throw new Error(`Telegram API Error: ${JSON.stringify(data)}`);
       }
       return true;
     } catch (error: any) {
       this.logger.error(`editMessageText failed: ${error.message}`, error.stack);
       return false;
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
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(`Telegram API Error: ${JSON.stringify(data)}`);
      } else {
        this.logger.log(`Message successfully delivered. Message ID: ${data.result?.message_id}`);
      }
    } catch (error: any) {
      this.logger.error(`sendMessage failed: ${error.message}`, error.stack);
    }
  }
}
