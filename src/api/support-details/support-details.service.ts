import { HttpException, Injectable } from '@nestjs/common';
import { CreateSupportDetailDto } from './dto/create-support-detail.dto';
import { UpdateSupportDetailDto } from './dto/update-support-detail.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { SupportFilter } from '@/api/support/dto/support.filter';
import { SupportDetailsFilter } from '@/api/support-details/dto/support-details.filter';
import { AppMessage } from '@/app/utils/messages.enum';
import { HttpStatusCode } from 'axios';
import { TwilioWebhookService } from '@/api/twilio-webhook/twilio-webhook.service';
import * as Twilio from 'twilio';

@Injectable()
export class SupportDetailsService {
  private client: Twilio.Twilio;

  constructor(private readonly prismaService: PrismaService) {
    this.client = new Twilio.Twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_TOKEN,
    );
  }

  async create(createSupportDetailDto: CreateSupportDetailDto) {
    const findReceiverData = await this.prismaService.support.findFirst({
      where: { id: createSupportDetailDto.support_id },
    });

    try {
      const data = await this.client.messages.create({
        body: createSupportDetailDto.message,
        from: `whatsapp:${process.env.SENDER_PHONE}`,
        to: `whatsapp:${findReceiverData.uid}`,
      });
    } catch (error) {
      console.error('Twilio Error:', error);
    }

    return this.prismaService.chat.create({
      data: createSupportDetailDto,
    });
  }

  async findAll(filterQuery: SupportDetailsFilter) {
    if (!filterQuery.page) {
      filterQuery.page = 1;
    }
    if (!filterQuery.limit) {
      filterQuery.limit = 10;
    }

    filterQuery.limit = filterQuery.limit === 0 ? 1 : filterQuery.limit;
    filterQuery.page = filterQuery.page === 0 ? 1 : filterQuery.page;

    filterQuery.page = parseInt(String(filterQuery.page));
    filterQuery.limit = parseInt(String(filterQuery.limit));

    const aggregation = [];

    /*Filter*/
    if (filterQuery.id) {
      aggregation.push({
        id: filterQuery.id,
      });
    }
    if (filterQuery.support_id) {
      aggregation.push({
        support_id: filterQuery.support_id,
      });
    }
    if (filterQuery.message) {
      aggregation.push({
        message: { contains: filterQuery.message, mode: 'insensitive' },
      });
    }

    if (filterQuery.sender) {
      aggregation.push({
        sender: { contains: filterQuery.sender, mode: 'insensitive' },
      });
    }

    if (filterQuery.sender_name) {
      aggregation.push({
        sender_name: { contains: filterQuery.sender_name, mode: 'insensitive' },
      });
    }

    /*
     *
     * Pagination Query
     *
     * */
    const data = await this.prismaService.chat.findMany({
      where: {
        OR: aggregation,
      },
    });
    const pagination = {
      page: filterQuery.page,
      limit: filterQuery.limit,
      total: data.length,
      totalPages:
        data.length < filterQuery.limit ? 1 : data.length / filterQuery.limit,
      hasNextPage: Boolean(
        data.length / filterQuery.limit !== filterQuery.page,
      ),
    };

    let allData;
    if (aggregation.length > 0) {
      allData = await this.prismaService.chat.findMany({
        take: pagination.limit,
        skip: (filterQuery.page - 1) * filterQuery.limit,
        where: {
          OR: aggregation,
        },
      });
    } else {
      allData = await this.prismaService.chat.findMany({
        take: pagination.limit,
        skip: (filterQuery.page - 1) * filterQuery.limit,
      });
    }

    return { ...pagination, allData };
  }

  findOne(id: string) {
    return this.prismaService.chat.findFirst({
      where: { id },
    });
  }

  async update(id: string, updateSupportDetailDto: UpdateSupportDetailDto) {
    const getSupportDetails = await this.prismaService.chat.findFirst({
      where: { id: id },
    });

    if (!Boolean(getSupportDetails))
      throw new HttpException(AppMessage.NOT_FOUND, HttpStatusCode.NotFound);
    return this.prismaService.chat.update({
      where: { id: id },
      data: updateSupportDetailDto,
    });
  }

  async remove(id: string) {
    const getSupportDetails = await this.prismaService.chat.findFirst({
      where: { id },
    });

    if (!Boolean(getSupportDetails))
      throw new HttpException(AppMessage.NOT_FOUND, HttpStatusCode.NotFound);

    return await this.prismaService.chat.delete({
      where: { id: id },
    });
  }
}
