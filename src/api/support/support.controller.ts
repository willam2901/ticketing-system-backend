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
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { EndpointEnum } from '@/app/utils/endpoint.enum';
import { SupportFilter } from '@/api/support/dto/support.filter';
import { AppMessage } from '@/app/utils/messages.enum';
import AppResponse from '@/app/utils/app-response.class';

@Controller(EndpointEnum.SUPPORT)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  create(@Body() createSupportDto: CreateSupportDto) {
    return this.supportService.create(createSupportDto);
  }

  @Get()
  async findAll(@Query() query: SupportFilter) {
    const data = await this.supportService.findAll(query);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.SUPPORT_GET_ALL_SUCCESS,
      data,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let data = await this.supportService.findOne(id);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.SUPPORT_GET_SUCCESS,
      data,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSupportDto: UpdateSupportDto,
  ) {
    let data = await this.supportService.update(id, updateSupportDto);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.SUPPORT_UPDATE_SUCCESS,
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let data = await this.supportService.remove(id);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.SUPPORT_DELETE_SUCCESS,
      data,
    });
  }
}
