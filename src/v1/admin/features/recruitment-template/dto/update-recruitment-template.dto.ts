// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Local files
import { IS_ACTIVE } from '@utils/constants';
import { IsOptional } from 'class-validator';

export class UpdateRecruitmentTemplateDto {
  @ApiProperty({
    required: true,
    description: 'Tên của mẫu yêu cầu tuyển dụng',
    example: 'Sale bất động sản',
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'Vị trí tuyển dụng ',
    enum: [1, 2],
  })
  professional_field_id: number;

  @ApiProperty({
    required: true,
    description: 'Hình thức làm việc',
    example: [1, 2, 3],
  })
  recruitment_job_type: string;

  @ApiProperty({
    required: true,
    description: 'Khu vực làm việc',
    enum: [101, 103],
  })
  df_province: number;

  @ApiProperty({
    required: true,
    description: 'Kinh nghiệm',
    enum: [1],
  })
  years_of_experience: number;

  @ApiProperty({
    required: true,
    description: 'Giới tính',
    enum: [1, 2, 3],
  })
  gender: number;

  @ApiProperty({
    required: true,
    description: 'Độ tuổi',
    enum: [1],
  })
  age_group: number;

  @ApiProperty({
    required: true,
    description: 'Mức lương',
    enum: [1],
  })
  salary_range: number;

  @ApiProperty({
    required: true,
    description: 'Số lượng tuyển',
  })
  recruitment_count: number;

  @ApiProperty({
    required: true,
    description: 'Mô tả công việc',
  })
  job_description: string;

  @ApiProperty({
    required: true,
    description: 'Giới thiệu về công ty',
  })
  enterprise_introduction: string;

  @ApiProperty({
    required: true,
    description: 'Phúc lợi và đãi ngộ',
  })
  benefits_and_treatment: string;

  @ApiProperty({
    required: true,
    description: 'Trạng thái hoạt động',
    enum: IS_ACTIVE,
  })
  status: number;

  @ApiProperty({
    required: true,
    description: 'Thời hạn nộp hồ sơ',
    example: 'Thời hạn nộp hồ sơ',
  })
  @IsOptional()
  apply_deadline: Date;
}
