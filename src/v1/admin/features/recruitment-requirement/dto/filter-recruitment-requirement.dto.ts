// Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
//Other dependencies
import { IsDateString, IsOptional, IsString } from 'class-validator';
//Local files
import { RECRUITMENT_STATUS } from '@utils/constants';
import { PagingDto } from 'src/shared/dto/paging.dto';

export class AdminFilterRecruitmentRequirementDto extends IntersectionType(
  PagingDto,
) {
  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo tên doanh nghiệp, số điện thoại, email',
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    description:
      'Lọc theo trạng thái: 1 - Đã xử lý, 2 -  Đang chờ, 3 - Từ trối, 4 - Đang xử lý',
    enum: RECRUITMENT_STATUS,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo sale phụ trách',
    example: '298,299',
  })
  @IsOptional()
  responsible_sale_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo tỉnh/thành phố của công ty/doanh nghiệp',
    example: '101,102',
  })
  @IsOptional()
  province_ids?: string;

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

  @ApiProperty({
    required: false,
    description: 'Lọc theo nghành nghề',
    example: '101,102',
  })
  @IsOptional()
  career_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo mức lương',
    example: '1,2',
  })
  @IsOptional()
  salary_range_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo kinh nghiệm',
    example: '101,102',
  })
  @IsOptional()
  years_of_experience_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo Chức vụ vị trí',
    example: '11,12',
  })
  @IsOptional()
  position_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày bắt đầu (thời hạn nộp hồ sơ)',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  apply_deadline_from_date?: Date;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày kết thúc (thời hạn nộp hồ sơ)',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  apply_deadline_to_date?: Date;
}
