import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SupportDetailsService } from './support-details.service';
import { CreateSupportDetailDto } from './dto/create-support-detail.dto';
import { UpdateSupportDetailDto } from './dto/update-support-detail.dto';

@Controller('support-details')
export class SupportDetailsController {
  constructor(private readonly supportDetailsService: SupportDetailsService) {}

  @Post()
  create(@Body() createSupportDetailDto: CreateSupportDetailDto) {
    return this.supportDetailsService.create(createSupportDetailDto);
  }

  @Get()
  findAll() {
    return this.supportDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportDetailsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupportDetailDto: UpdateSupportDetailDto,
  ) {
    return this.supportDetailsService.update(id, updateSupportDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supportDetailsService.remove(id);
  }
}
