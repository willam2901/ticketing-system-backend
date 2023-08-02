import { HttpException, Injectable } from '@nestjs/common';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { SupportFilter } from '@/api/support/dto/support.filter';
import { AppMessage } from '@/app/utils/messages.enum';
import { HttpStatusCode } from 'axios';

@Injectable()
export class SupportService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSupportDto: CreateSupportDto) {
    return await this.prismaService.support.create({
      data: createSupportDto,
    });
  }

  async findAll(filterQuery: SupportFilter) {
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

    let aggregation = [];

    /*Filter*/
    if (filterQuery.id) {
      aggregation.push({
        id: filterQuery.id,
      });
    }
    if (filterQuery.uid) {
      aggregation.push({
        uid: filterQuery.uid,
      });
    }
    if (filterQuery.caseClosed) {
      aggregation.push({
        caseClosed: filterQuery.caseClosed,
      });
    }

    if (filterQuery.title) {
      aggregation.push({
        title: { contains: filterQuery.title, mode: 'insensitive' },
      });
    }

    if (filterQuery.description) {
      aggregation.push({
        description: { contains: filterQuery.description, mode: 'insensitive' },
      });
    }

    /*
     *
     * Pagination Query
     *
     * */
    let data = await this.prismaService.support.findMany({
      where: {
        OR: aggregation,
      },
    });
    let pagination = {
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
      allData = await this.prismaService.support.findMany({
        take: pagination.limit,
        skip: (filterQuery.page - 1) * filterQuery.limit,
        where: {
          OR: aggregation,
        },
      });
    } else {
      allData = await this.prismaService.support.findMany({
        take: pagination.limit,
        skip: (filterQuery.page - 1) * filterQuery.limit,
      });
    }

    return { ...pagination, allData };
  }

  async findOne(id: string) {
    return this.prismaService.support.findFirst({
      where: { id },
      include: {
        chat: true,
      },
    });
  }

  async update(id: string, updateSupportDto: UpdateSupportDto) {
    let getSupport = await this.prismaService.support.findFirst({
      where: { id: id },
    });

    if (!Boolean(getSupport))
      throw new HttpException(AppMessage.NOT_FOUND, HttpStatusCode.NotFound);
    return this.prismaService.support.update({
      where: { id: id },
      data: updateSupportDto,
    });
  }

  async remove(id: string) {
    let getSupport = await this.prismaService.support.findFirst({
      where: { id },
    });

    if (!Boolean(getSupport))
      throw new HttpException(AppMessage.NOT_FOUND, HttpStatusCode.NotFound);

    return await this.prismaService.support.delete({
      where: { id: id },
    });
  }
}
