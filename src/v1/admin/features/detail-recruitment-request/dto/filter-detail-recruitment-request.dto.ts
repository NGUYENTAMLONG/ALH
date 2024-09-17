import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { INTEREST_LIST_STATUS } from '@utils/constants';
import { IsDateString, IsOptional } from 'class-validator';
import { PagingDto } from 'src/shared/dto/paging.dto';

export class AdminFilterDetailRecruitmentRequestDto extends IntersectionType(
  PagingDto,
) {
  @ApiProperty({
    required: true,
    description: 'ID của doanh nghiệp',
  })
  enterprise_id: number;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo tên ứng viên, số điện thoại',
  })
  @IsOptional()
  search?: string;

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
    description:
      'Lọc theo trạng thái: 1 - Chờ duyệt, 2 -  Đang liên hệ, 3 - Từ chối, 4 - Đã duyệt, 5- Đã hết hạn',
    enum: INTEREST_LIST_STATUS,
  })
  @IsOptional()
  status?: number;

  @ApiProperty({
    required: false,
    description: 'Lọc theo địa điểm làm việc',
    example: '101,102',
  })
  @IsOptional()
  df_province_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo vị trí công việc',
    example: '1,2',
  })
  @IsOptional()
  professional_field_ids?: string;
}
