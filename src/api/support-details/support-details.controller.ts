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
import { SupportDetailsService } from './support-details.service';
import { CreateSupportDetailDto } from './dto/create-support-detail.dto';
import { UpdateSupportDetailDto } from './dto/update-support-detail.dto';
import { SupportDetailsFilter } from '@/api/support-details/dto/support-details.filter';
import AppResponse from '@/app/utils/app-response.class';
import { AppMessage } from '@/app/utils/messages.enum';
import { Roles } from 'nest-keycloak-connect';
import { UserRole } from '@/app/common/user-role.enum';
import { Whoiam } from '@/app/decorators/whoiam-decorator';

@Controller('support-details')
export class SupportDetailsController {
  constructor(private readonly supportDetailsService: SupportDetailsService) {}

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
  @Post()
  create(@Body() createSupportDetailDto: CreateSupportDetailDto) {
    return this.supportDetailsService.create(createSupportDetailDto);
  }

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
  @Get()
  async findAll(@Query() query: SupportDetailsFilter) {
    const data = await this.supportDetailsService.findAll(query);
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
    let data = await this.supportDetailsService.findOne(id);
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

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
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
