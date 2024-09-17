import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { RECRUITMENT_STATUS } from '@utils/constants';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PagingDto } from 'src/shared/dto/paging.dto';

export class FilterRecruitmentFavoriteDto extends IntersectionType(PagingDto) {
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
    description: 'Lọc theo tỉnh/thành phố',
    example: '101,102',
  })
  @IsOptional()
  province_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo nghành nghề',
    example: '101,102',
  })
  @IsOptional()
  career_ids?: string;

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
