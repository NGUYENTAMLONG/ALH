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

export class AdminCreateRecruitmentDto {
  @ApiProperty({
    required: true,
    description: 'Trạng thái của yêu cầu tuyển dụng',
    example: 1,
  })
  @IsNumber(
    {},
    {
      message: 'Vui lòng nhập id số',
    },
  )
  @IsOptional()
  status: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống doanh nghiệp',
  })
  enterprise_id: number;

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
    description: 'Vị trí tuyển dụng ',
    enum: [1, 2],
  })
  @IsOptional()
  professional_field_id: number;

  @ApiProperty({
    required: true,
    description: 'Vị trí tuyển dụng input',
    example: 'CEO',
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
    example: [101, 103],
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
    description: 'Ngành nghề tuyển dụng ',
    enum: [1, 2],
  })
  @IsOptional()
  career_field_id: number;

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
    description: 'Loại thu phí',
  })
  @IsOptional()
  fee_type_id: number;

  @ApiProperty({
    required: true,
    description: 'Loại thu phí',
  })
  @IsOptional()
  price: number;

  @ApiProperty({
    required: true,
    description: 'Loại thu phí',
  })
  @IsOptional()
  hro_price: number;

  @ApiProperty({
    required: false,
    description: 'sale phụ trách',
  })
  @IsOptional()
  @IsNumber()
  responsible_sale_id: number;

  @ApiProperty({
    required: false,
    description: 'Sale triển khai',
    example: [101, 103],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true }) // Apply IsNumber decorator to each array element
  implementation_sale_ids: number[];

  @ApiProperty({
    required: true,
    description: 'Tất cả hro',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  is_all_hro: number;

  @ApiProperty({
    required: false,
    description: 'list hro',
    example: [101, 103],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true }) // Apply IsNumber decorator to each array element
  hro_ids: number[];

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
}
