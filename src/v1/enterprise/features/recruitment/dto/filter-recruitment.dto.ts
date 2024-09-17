import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { FEE_TYPE, RECRUITMENT_STATUS } from '@utils/constants';
import { IsDateString, IsOptional } from 'class-validator';
import { PagingDto } from 'src/shared/dto/paging.dto';

export class FilterRecruitmentDto extends IntersectionType(PagingDto) {
  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo mã yêu cầu',
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

  @ApiProperty({
    required: false,
    description: 'Lọc theo loại yêu cầu: 1 - CV, 2 -  Hunt',
    enum: FEE_TYPE,
  })
  @IsOptional()
  fee_type?: number;
}
