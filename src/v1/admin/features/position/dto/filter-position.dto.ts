import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { PagingDto } from 'src/shared/dto/paging.dto';

export class FilterPositionDto extends IntersectionType(PagingDto) {
  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo tên chức vụ',
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày bắt đầu',
    example: '2023-08-01',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  from_date?: Date;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày kết thúc',
    example: '2023-08-31',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  to_date?: Date;
}
