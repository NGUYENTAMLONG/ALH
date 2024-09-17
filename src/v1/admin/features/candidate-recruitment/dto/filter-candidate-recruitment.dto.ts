//Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
//Other dependencies
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
//Local files
import { PagingDto } from 'src/shared/dto/paging.dto';

export class FilterAdminCandidateRecruitment extends IntersectionType(
  PagingDto,
) {
  @ApiProperty({
    required: true,
    description: 'Tìm kiếm theo yêu cầu tuyển dụng',
    example: 153,
  })
  @IsNotEmpty()
  recruitment_requirement_id: number;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo tên hoặc số điện thoại',
    example: 'An',
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo trạng thái',
    example: '1',
  })
  @IsOptional()
  status?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày tạo',
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
    description: 'Lọc theo ngày tạo',
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

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày phỏng vấn',
    example: '2023-08-01',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  schedule_from_date?: Date;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày phỏng vấn',
    example: '2023-08-31',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  schedule_to_date?: Date;
}
