import { Controller, Post, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Telegram')
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('webhook')
  @ApiOperation({ summary: 'Telegram webhook receiver' })
  handleWebhook(@Body() update: any) {
    // Fire and forget to return HTTP 200 instantly
    this.telegramService.handleWebhook(update).catch(err => console.error('Unhandled webhook error:', err));
    return { ok: true };
  }
}
