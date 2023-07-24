import { Injectable } from '@nestjs/common';
import { CreateSupportDetailDto } from './dto/create-support-detail.dto';
import { UpdateSupportDetailDto } from './dto/update-support-detail.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SupportDetailsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSupportDetailDto: CreateSupportDetailDto) {
    return this.prismaService.supportDetails.create({
      data: createSupportDetailDto,
    });
  }

  findAll() {
    return this.prismaService.supportDetails.findMany();
  }

  findOne(id: string) {
    return `This action returns a #${id} supportDetail`;
  }

  update(id: string, updateSupportDetailDto: UpdateSupportDetailDto) {
    return `This action updates a #${id} supportDetail`;
  }

  remove(id: string) {
    return `This action removes a #${id} supportDetail`;
  }
}
