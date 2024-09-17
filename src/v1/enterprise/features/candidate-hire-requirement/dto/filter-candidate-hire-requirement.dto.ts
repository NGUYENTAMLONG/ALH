//Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { JOB_TYPE } from '@utils/constants';
//Other dependencies
import { IsNotEmpty, IsOptional } from 'class-validator';
//Local files
import { PagingDto } from 'src/shared/dto/paging.dto';

export class FilterEnterpriseCandidateHireRequirementDto extends IntersectionType(
  PagingDto,
) {
  @ApiProperty({
    required: true,
    description: 'Tìm kiếm theo yêu cầu thuê',
    example: 153,
  })
  @IsNotEmpty()
  hire_requirement_id: number;

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
    example: 1,
  })
  @IsNotEmpty()
  status?: number;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo vị trí làm việc',
    example: 1,
  })
  @IsOptional()
  professional_field_id?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo mức lương',
    example: 1,
  })
  @IsOptional()
  salary_range_id?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo loại công việc: 1 - Theo cuộc gọi, 2 -  Theo giờ',
    enum: JOB_TYPE,
  })
  @IsOptional()
  job_type?: number;
}
