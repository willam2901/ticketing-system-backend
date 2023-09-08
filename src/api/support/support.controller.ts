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
  UseGuards,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { EndpointEnum } from '@/app/utils/endpoint.enum';
import { SupportFilter } from '@/api/support/dto/support.filter';
import { AppMessage } from '@/app/utils/messages.enum';
import AppResponse from '@/app/utils/app-response.class';
import { Roles } from 'nest-keycloak-connect';
import { Whoiam } from '@/app/decorators/whoiam-decorator';
import { UserRole } from '@/app/common/user-role.enum';

@Controller(EndpointEnum.SUPPORT)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
  @Post()
  create(@Body() createSupportDto: CreateSupportDto) {
    return this.supportService.create(createSupportDto);
  }

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
  @Get()
  async findAll(@Query() query: SupportFilter) {
    const data = await this.supportService.findAll(query);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.SUPPORT_GET_ALL_SUCCESS,
      data,
    });
  }

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.supportService.findOne(id);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.SUPPORT_GET_SUCCESS,
      data,
    });
  }

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSupportDto: UpdateSupportDto,
  ) {
    const data = await this.supportService.update(id, updateSupportDto);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.SUPPORT_UPDATE_SUCCESS,
      data,
    });
  }

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.supportService.remove(id);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.SUPPORT_DELETE_SUCCESS,
      data,
    });
  }
}
