import { PartialType } from '@nestjs/mapped-types';
import { CreateSupportsDto } from './create-supports.dto';

export class UpdateSupportsDto extends PartialType(CreateSupportsDto) {
  id: number;
}
