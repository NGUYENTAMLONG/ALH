import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FilterDistrictDto {
  @ApiProperty({
    required: false,
    description: 'Tên quận huyện',
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'id của tỉnh thành phố',
  })
  @IsOptional()
  df_province_id: number;
}
