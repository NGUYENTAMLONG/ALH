// Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';

// Other dependencies
import { IsDateString, IsOptional } from 'class-validator';

// Local files
import { IS_ACTIVE } from '@utils/constants';
import { PagingDto } from 'src/shared/dto/paging.dto';

export class FilterRecruitmentTemplateDto extends IntersectionType(PagingDto) {
  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo tên',
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo trạng thái: 1 - Hoạt động, 2 -  Ngưng hoạt động',
    enum: IS_ACTIVE,
  })
  @IsOptional()
  status?: number;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày bắt đầu',
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
