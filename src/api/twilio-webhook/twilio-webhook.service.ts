import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';
import { SupportService } from '@/api/support/support.service';
import { CreateSupportDto } from '@/api/support/dto/create-support.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { CommandEnum } from '@/api/twilio-webhook/enum/command.enum';

@Injectable()
export class TwilioWebhookService {
  private client: Twilio.Twilio;

  constructor(
    private readonly supportService: SupportService,
    private readonly prismaService: PrismaService,
  ) {
    this.client = new Twilio.Twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_TOKEN,
    );
  }

  async support(payload: any) {
    if (payload.Body.toLowerCase() === CommandEnum.HELP) {
      let data = await this.prismaService.support.create({
        data: {
          uid: payload.WaId,
          name: payload.ProfileName,
          title: payload.Body,
          description: '',
        },
      });

      await this.prismaService.supportDetails.create({
        data: {
          support_id: data.id,
          message: data.title,
          sender: payload.WaId,
          sender_name: payload.ProfileName,
        },
      });

      await this.sendWhatsAppMessage(payload.WaId, 'Describe your issue.');
    } else {
      const lastSupport = await this.prismaService.support.findFirst({
        where: { uid: payload.WaId },
        orderBy: { createdAt: 'desc' },
        take: 1,
      });

      if (!Boolean(lastSupport)) {
        await this.sendWhatsAppMessage(
          payload.WaId,
          'Type `Help` for create new Support ',
        );
      } else {
        await this.prismaService.supportDetails.create({
          data: {
            support_id: lastSupport.id,
            message: payload.Body,
            sender: payload.WaId,
            sender_name: lastSupport.name,
          },
        });
      }
      console.log(lastSupport);
    }

    return true;
  }

  async sendWhatsAppMessage(to: string, body: string) {
    try {
      let data = await this.client.messages.create({
        body: body,
        from: `whatsapp:${process.env.SENDER_PHONE}`,
        to: `whatsapp:${to}`,
      });
    } catch (error) {
      console.error('Twilio Error:', error);
    }
  }
}
