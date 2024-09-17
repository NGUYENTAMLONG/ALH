import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PagingDto {
  @ApiProperty({
    required: false,
    description: 'Vị trị số trang đang đứng, số mặc định là page 1',
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    required: false,
    description:
      'Số lượng phần tử trong một trang, số phẩn tử mặc định sẽ là 12',
  })
  @IsOptional()
  limit?: number;
}
