import { Injectable } from '@nestjs/common';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SupportService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSupportDto: CreateSupportDto) {
    return this.prismaService.support.create({ data: createSupportDto });
  }

  async findAll() {
    return this.prismaService.support.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.support.findFirst({ where: { id } });
  }

  update(id: string, updateSupportDto: UpdateSupportDto) {
    return this.prismaService.support.update({
      where: { id },
      data: updateSupportDto,
    });
  }

  remove(id: string) {
    return this.prismaService.support.delete({ where: { id } });
  }
}
