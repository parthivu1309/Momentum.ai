import { Controller, Post, Req, Logger } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Request } from 'express';

@ApiTags('Telegram')
@Controller('telegram')
export class TelegramController {
  private readonly logger = new Logger(TelegramController.name);

  constructor(private readonly telegramService: TelegramService) {}

  @Post('webhook')
  @ApiOperation({ summary: 'Telegram webhook receiver' })
  handleWebhook(@Req() req: Request) {
    const update = req.body;
    
    this.logger.log('========== WEBHOOK RECEIVED ==========');
    this.logger.log(JSON.stringify(update, null, 2));

    // Fire and forget to return HTTP 200 instantly
    this.telegramService.handleWebhook(update).catch(err => 
      this.logger.error('Unhandled webhook error:', err)
    );
    
    return { ok: true };
  }
}
