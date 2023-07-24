import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSupportDto } from './create-support.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateSupportDto extends PartialType(CreateSupportDto) {}
