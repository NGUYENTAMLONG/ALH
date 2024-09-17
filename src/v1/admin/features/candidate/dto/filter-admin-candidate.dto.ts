//Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
//Other dependencies
import { IsDateString, IsOptional } from 'class-validator';
//Local files
import { PagingDto } from 'src/shared/dto/paging.dto';

export class FilterAdminCandidate extends IntersectionType(PagingDto) {
  @ApiProperty({
    required: false,
    description: 'Chuyển tab danh sách ứng viên, cộng tác viên',
    example: '3 / 7',
  })
  @IsOptional()
  role_tab?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo tên hoặc số điện thoại',
    example: 'An',
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo địa điểm làm việc',
    example: '101,102',
  })
  @IsOptional()
  df_province_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo địa điểm làm việc',
    example: 1,
  })
  @IsOptional()
  is_all_province: number;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo vị trí công việc',
    example: '1',
  })
  @IsOptional()
  professional_field_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo hình thức làm việc',
    example: '1',
  })
  @IsOptional()
  job_type_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo trạng thái',
    example: '1',
  })
  @IsOptional()
  status?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo ứng viên thuê',
    example: 1,
  })
  @IsOptional()
  is_hire?: number;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo ứng viên tuyển',
    example: 1,
  })
  @IsOptional()
  is_recruitment?: number;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày quan tâm',
    example: '2023-08-01',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  interest_from_date?: Date;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày quan tâm',
    example: '2023-08-31',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  interest_to_date?: Date;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày duyệt',
    example: '2023-08-01',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  approve_from_date?: Date;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày duyệt',
    example: '2023-08-31',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  approve_to_date?: Date;
}
