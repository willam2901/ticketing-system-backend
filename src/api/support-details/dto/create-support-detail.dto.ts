import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSupportDetailDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  support_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  message: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  sender: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  sender_name: string;
}
