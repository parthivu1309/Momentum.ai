import { Module } from '@nestjs/common';
import { AiProviderService } from './ai-provider.service';
import { AiTestController } from './ai-test.controller';

@Module({
  controllers: [AiTestController],
  providers: [AiProviderService],
  exports: [AiProviderService]
})
export class AiModule {}
