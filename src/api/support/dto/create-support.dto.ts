import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SupportDetail } from '@/api/support-details/entities/support-detail.entity';

export class CreateSupportDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  uid: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  description: string;
}
