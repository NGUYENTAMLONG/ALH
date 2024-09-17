import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PagingDto } from 'src/shared/dto/paging.dto';

export class EnterpriseFilterInterestListDto extends IntersectionType(
  PagingDto,
) {
  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo tên ứng viên',
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Loại công việc',
  })
  @IsOptional()
  type?: number;

  @ApiProperty({
    required: false,
    description: 'Lọc theo hình thức làm việc',
    example: 2,
  })
  @IsOptional()
  job_type?: number;

  @ApiProperty({
    required: false,
    description: 'Lọc theo giá thuê min',
    example: 2,
  })
  @IsOptional()
  budget_min: number;

  @ApiProperty({
    required: false,
    description: 'Lọc theo giá thuê max',
    example: 2,
  })
  @IsOptional()
  budget_max: number;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo độ tuổi',
    example: '1,2',
  })
  @IsOptional()
  age_group_ids?: string;
}
