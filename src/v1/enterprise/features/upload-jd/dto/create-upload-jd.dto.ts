import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUploadJdDto {
  @ApiProperty({
    required: true,
  })
  @IsString({
    message: 'Vui lòng điền jd là một chuỗi',
  })
  jd: string;

  @ApiProperty({
    required: true,
    description: 'Loại thu phí',
  })
  @IsOptional()
  fee_type_id: number;

  @ApiProperty({
    required: true,
    description: 'Loại thu phí',
  })
  @IsOptional()
  price: number;
}
