//Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
//Other dependencies
import { IsDateString, IsOptional } from 'class-validator';
//Local files
import { PagingDto } from 'src/shared/dto/paging.dto';

export class AdminFilterScheduleInterviewDto extends IntersectionType(
  PagingDto,
) {
  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo yêu cầu tuyển dụng',
    example: 153,
  })
  @IsOptional()
  recruitment_requirement_id: number;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo doanh nghiệp',
    example: 153,
  })
  @IsOptional()
  enterprise_id: number;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo ứng viên',
    example: 153,
  })
  @IsOptional()
  candidate_id: number;

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
  from_date?: Date;

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
  to_date?: Date;
}
