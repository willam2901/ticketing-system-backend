import { Injectable } from '@nestjs/common';
import { CreateSupportsDto } from './dto/create-supports.dto';
import { UpdateSupportsDto } from './dto/update-supports.dto';

@Injectable()
export class SupportsService {
  create(createSupportDto: CreateSupportsDto) {
    return 'This action adds a new support';
  }

  findAll() {
    return `This action returns all supports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} support`;
  }

  update(id: number, updateSupportDto: UpdateSupportsDto) {
    return `This action updates a #${id} support`;
  }

  remove(id: number) {
    return `This action removes a #${id} support`;
  }
}
