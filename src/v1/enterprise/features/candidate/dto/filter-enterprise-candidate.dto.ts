//Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
//Other dependencies
import { IsOptional } from 'class-validator';
//Local dependencies
import { PagingDto } from 'src/shared/dto/paging.dto';

export class FilterEnterpriseCandidateDto extends IntersectionType(PagingDto) {
  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo địa điểm làm việc',
    example: '101,102',
  })
  @IsOptional()
  df_province_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo ngành nghề',
    example: '1',
  })
  @IsOptional()
  professional_field_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo hình thức làm việc',
    example: '1,2',
  })
  @IsOptional()
  job_type_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo độ tuổi',
    example: '1,2',
  })
  @IsOptional()
  age_group_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo kinh nghiệm ',
    example: '1,2',
  })
  @IsOptional()
  years_of_experience_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo giới tính ',
    example: '1,2',
  })
  @IsOptional()
  gender_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo mức lương ',
    example: '1,2',
  })
  @IsOptional()
  salary_range_ids?: string;
}
