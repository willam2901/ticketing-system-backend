import { Module } from '@nestjs/common';
import { SupportDetailsService } from './support-details.service';
import { SupportDetailsController } from './support-details.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { TwilioWebhookService } from '@/api/twilio-webhook/twilio-webhook.service';

@Module({
  imports: [],
  controllers: [SupportDetailsController],
  providers: [SupportDetailsService, PrismaService],
})
export class SupportDetailsModule {}
