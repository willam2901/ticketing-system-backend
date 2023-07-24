import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { SupportDetailsService } from './support-details.service';
import { CreateSupportDetailDto } from './dto/create-support-detail.dto';
import { UpdateSupportDetailDto } from './dto/update-support-detail.dto';
import { SupportDetailsFilter } from '@/api/support-details/dto/support-details.filter';
import AppResponse from '@/app/utils/app-response.class';
import { AppMessage } from '@/app/utils/messages.enum';

@Controller('support-details')
export class SupportDetailsController {
  constructor(private readonly supportDetailsService: SupportDetailsService) {}

  @Post()
  create(@Body() createSupportDetailDto: CreateSupportDetailDto) {
    return this.supportDetailsService.create(createSupportDetailDto);
  }

  @Get()
  async findAll(@Query() query: SupportDetailsFilter) {
    const data = await this.supportDetailsService.findAll(query);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.SUPPORT_GET_ALL_SUCCESS,
      data,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let data = await this.supportDetailsService.findOne(id);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.SUPPORT_GET_SUCCESS,
      data,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSupportDetailDto: UpdateSupportDetailDto,
  ) {
    let data = await this.supportDetailsService.update(
      id,
      updateSupportDetailDto,
    );
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.SUPPORT_UPDATE_SUCCESS,
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let data = await this.supportDetailsService.remove(id);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.SUPPORT_DELETE_SUCCESS,
      data,
    });
  }
}
