import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SupportsService } from './supports.service';
import { CreateSupportsDto } from './dto/create-supports.dto';
import { UpdateSupportsDto } from './dto/update-supports.dto';
import { EndpointEnum } from '@/app/utils/endpoint.enum';

@Controller()
export class SupportsController {
  constructor(private readonly supportsService: SupportsService) {}

  @MessagePattern(EndpointEnum.SUPPORT_CREATE)
  create(@Payload() createSupportDto: CreateSupportsDto) {
    return this.supportsService.create(createSupportDto);
  }

  @MessagePattern(EndpointEnum.SUPPORT_GET_ALL)
  findAll() {
    return this.supportsService.findAll();
  }

  @MessagePattern(EndpointEnum.SUPPORT_GET)
  findOne(@Payload() id: number) {
    return this.supportsService.findOne(id);
  }

  @MessagePattern(EndpointEnum.SUPPORT_UPDATE)
  update(@Payload() updateSupportDto: UpdateSupportsDto) {
    return this.supportsService.update(updateSupportDto.id, updateSupportDto);
  }

  @MessagePattern(EndpointEnum.SUPPORT_DELETE)
  remove(@Payload() id: number) {
    return this.supportsService.remove(id);
  }
}
