// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// Other dependencies
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
class FormJdUpload {
  @ApiProperty({
    required: true,
    description: 'file',
    example: 'gsdjhfjskjfskldjhsfl;dks',
  })
  @IsString()
  @IsNotEmpty()
  file: string;

  @ApiProperty({
    required: true,
    description: 'file_name',
    example: 'gsdjhfjskjfskldjhsfl;dks',
  })
  @IsString()
  @IsNotEmpty()
  file_name: string;
}
export class CreateRecruitmentDto {
  @ApiProperty({
    required: false,
    description: 'Chọn mẫu nội dung tuyển dụng theo vị trí',
    example: null,
  })
  @IsOptional()
  model_content_recruitment?: number;

  @ApiProperty({
    required: true,
  })
  @IsArray({ message: 'Vui lòng nhập một mảng' })
  @ValidateNested()
  @Type(() => FormJdUpload)
  @IsOptional()
  jd: FormJdUpload[];

  @ApiProperty({
    required: true,
    description: 'Ngành nghề tuyển dụng ',
    enum: [1, 2],
  })
  @IsOptional()
  career_id: number;

  @ApiProperty({
    required: true,
    description: 'Vị trí tuyển dụng ',
    enum: [1, 2],
  })
  @IsOptional()
  professional_field_id: number;

  @ApiProperty({
    required: true,
    description: 'Vị trí tuyển dụng ',
    enum: [1, 2],
  })
  @IsOptional()
  position_id: number;

  @ApiProperty({
    required: true,
    description: 'Vị trí tuyển dụng input',
    example: 'CEO',
  })
  @IsOptional()
  position_input: string;

  @ApiProperty({
    required: true,
    description: 'Vị trí tuyển dụng input',
    example: 'Sale',
  })
  @IsOptional()
  professional_field_input: string;

  @ApiProperty({
    required: true,
    description: 'Hình thức làm việc',
    example: '[1,2,3]',
  })
  @IsOptional()
  recruitment_job_type: string;

  @ApiProperty({
    required: true,
    description: 'Khu vực làm việc',
    enum: [101, 103],
  })
  @IsOptional()
  @IsArray({ message: 'Vui lòng nhập khu vực là một mảng' })
  @IsNumber({}, { each: true, message: 'Vui lòng nhập id của khu vực là số' }) // Apply IsNumber decorator to each array element
  df_province: number[];

  @ApiProperty({
    required: true,
    description: 'Toàn quốc',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  is_all_province: number;

  @ApiProperty({
    required: true,
    description: 'Kinh nghiệm',
    enum: [1],
  })
  @IsOptional()
  years_of_experience: number;

  @ApiProperty({
    required: false,
    description: 'Giới tính',
    enum: [1, 2, 3],
  })
  @IsOptional()
  @IsNumber()
  gender_id: number;

  @ApiProperty({
    required: false,
    description: 'Độ tuổi',
    enum: [1],
  })
  @IsOptional()
  age_group: number;

  @ApiProperty({
    required: false,
    description: 'Mức lương',
    enum: [1],
  })
  @IsOptional()
  salary_range: number;

  @ApiProperty({
    required: true,
    description: 'Số lượng tuyển',
  })
  @IsOptional()
  recruitment_count: number;

  @ApiProperty({
    required: true,
    description: 'Mô tả công việc',
  })
  @IsOptional()
  job_description: string;

  @ApiProperty({
    required: true,
    description: 'Giới thiệu về công ty',
  })
  @IsOptional()
  enterprise_introduction: string;

  @ApiProperty({
    required: true,
    description: 'Phúc lợi và đãi ngộ',
  })
  @IsOptional()
  benefits_and_treatment: string;

  @ApiProperty({
    required: true,
    description: 'Địa điểm làm việc chi tiết',
    example: '299 Trung Kinh Cầu Giấy',
  })
  @IsOptional()
  work_address: string;

  @ApiProperty({
    required: true,
    description: 'Thời hạn nộp hồ sơ',
    example: 'Thời hạn nộp hồ sơ',
  })
  @IsOptional()
  apply_deadline: Date;

  @ApiProperty({
    required: false,
    description: 'Xác nhận chỉ tạo yêu cầu tuyển dụng với file jd',
  })
  @IsOptional()
  is_just_jd: number;

  @ApiProperty({
    required: true,
    description:
      'Trạng thái đăng (3-Đã trong tiến trình đăng tuyển (PROCESSED) | 11-Nháp (Draft))',
    enum: [3, 11],
  })
  @IsOptional()
  status: number;
}
