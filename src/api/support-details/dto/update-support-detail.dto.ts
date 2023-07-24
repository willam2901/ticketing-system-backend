import { PartialType } from '@nestjs/swagger';
import { CreateSupportDetailDto } from './create-support-detail.dto';

export class UpdateSupportDetailDto extends PartialType(CreateSupportDetailDto) {}
