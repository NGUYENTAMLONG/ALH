import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FilterProvinceDto {
  @ApiProperty({
    required: false,
    description: 'Tên tỉnh thành phố',
  })
  @IsOptional()
  search?: string;
}
