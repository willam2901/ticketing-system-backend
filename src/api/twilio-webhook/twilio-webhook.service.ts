import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';
import { SupportService } from '@/api/support/support.service';
import { CreateSupportDto } from '@/api/support/dto/create-support.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { CommandEnum } from '@/api/twilio-webhook/enum/command.enum';
import { UpdateSupportDto } from '@/api/support/dto/update-support.dto';

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
      /*
       *  SUPPORT CREATE
       *  AND SEND REPLY TO CUSTOMER
       *
       * */
      const data = await this.prismaService.support.create({
        data: {
          uid: payload.WaId,
          name: payload.ProfileName,
          title: payload.Body,
          description: '',
        },
      });
      await this.prismaService.chat.create({
        data: {
          support_id: data.id,
          message: data.title,
          sender: payload.WaId,
          sender_name: payload.ProfileName,
        },
      });
      await this.sendMessage(payload.WaId, payload.Body);
      //SUPPORT CREATE END
    } else {
      /*
       * CHECK ALREADY SUPPORT EXIST AND RUNNING OR NOT.
       * */
      const lastSupport = await this.prismaService.support.findFirst({
        where: { uid: payload.WaId },
        orderBy: { createdAt: 'desc' },
        take: 1,
      });

      if (Boolean(lastSupport)) {
        const findLength = await this.prismaService.chat.count({
          where: { support_id: lastSupport.id },
        });

        console.log('LENGTH', findLength);

        if (findLength === 1) {
          await this.sendWhatsAppMessage(
            payload.WaId,
            'Your ticket created Successfully. An authorised person will contact with you soon. ',
          );
        }
      }

      if (
        payload.Body.toLowerCase() === CommandEnum.DONE &&
        lastSupport.caseClosed === false
      ) {
        /*
         * SUPPORT CLOSE.
         * */
        await this.prismaService.chat.create({
          data: {
            support_id: lastSupport.id,
            message: payload.Body,
            sender: payload.WaId,
            sender_name: lastSupport.name,
          },
        });

        await this.prismaService.support.update({
          where: { id: lastSupport.id },
          data: { caseClosed: true },
        });
        await this.sendMessage(payload.WaId, payload.Body);
      } else if (!Boolean(lastSupport)) {
        /*
         * IF SUPPORT NOT EXIST .
         * */
        await this.sendWhatsAppMessage(
          payload.WaId,
          'Type `Help` for create new Support ',
        );
      } else if (lastSupport.caseClosed === false) {
        await this.prismaService.chat.create({
          data: {
            support_id: lastSupport.id,
            message: payload.Body,
            sender: payload.WaId,
            sender_name: lastSupport.name,
          },
        });
        await this.sendMessage(payload.WaId, payload.Body);
      }
    }

    return true;
  }

  async sendWhatsAppMessage(to: string, body: string) {
    try {
      const data = await this.client.messages.create({
        body: body,
        from: `whatsapp:${process.env.SENDER_PHONE}`,
        to: `whatsapp:${to}`,
      });
    } catch (error) {
      console.error('Twilio Error:', error);
    }
  }

  async sendMessage(to: string, command: string) {
    const responseMsg = await this.prismaService.command.findFirst({
      where: {
        command: {
          contains: command.replace(/\s+/g, ' '),
          mode: 'insensitive',
        },
      },
    });
    if (responseMsg !== null) {
      await this.sendWhatsAppMessage(to, `${responseMsg.response}`);
    }
  }

  async defaultMessage(payload: any) {
    const data = await this.prismaService.command.findFirst({
      where: {
        command: 'DEFAULT',
      },
    });

    console.log('============', data);

    await this.sendWhatsAppMessage(payload.WaId, data.response);
  }
}
