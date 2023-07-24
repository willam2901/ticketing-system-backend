import { Module } from '@nestjs/common';
import { TwilioWebhookService } from './twilio-webhook.service';
import { TwilioWebhookController } from './twilio-webhook.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { SupportService } from '@/api/support/support.service';

@Module({
  imports: [],
  controllers: [TwilioWebhookController],
  providers: [TwilioWebhookService, PrismaService, SupportService],
})
export class TwilioWebhookModule {}
