import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupportDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  uid: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  description: string;
}
