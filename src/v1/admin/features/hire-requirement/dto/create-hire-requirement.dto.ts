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
export class AdminCreateHireRequirementDto {
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
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    required: true,
    description: 'Vị trí tuyển dụng ',
    enum: [1, 2],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  professional_field_ids: number[];

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
    description: 'Kinh nghiệm',
    enum: [1],
  })
  @IsOptional()
  years_of_experience_id: number;

  @ApiProperty({
    required: true,
    description: 'Hình thức làm việc',
    example: [1, 2, 3],
  })
  @IsOptional()
  recruitment_job_type: number[];

  @ApiProperty({
    description: 'Số lượng tuyển',
    example: 20,
  })
  @IsOptional()
  recruitment_count: number;

  @ApiProperty({
    description: 'Ghi chú',
    example: 'note',
  })
  @IsOptional()
  note: string;

  @ApiProperty({
    description: 'Loại công việc theo cuộc gọi',
    example: 1,
  })
  @IsOptional()
  type_on_call: number;

  @ApiProperty({
    description: 'Loại công việc theo giờ',
    example: 1,
  })
  @IsOptional()
  type_on_hour: number;

  @ApiProperty({
    description: 'Số lượng',
    example: 1,
  })
  @IsOptional()
  count: number;

  @ApiProperty({
    description: 'Đơn giá',
    example: 1,
  })
  @IsOptional()
  price: number;

  @ApiProperty({
    description: 'Giá thuê cuối cùng',
    example: 1,
  })
  @IsOptional()
  total_price: number;

  @ApiProperty({
    description: 'Ngân sách dự kiến Min',
    example: 1,
  })
  @IsOptional()
  budget_min: number;

  @ApiProperty({
    description: 'Ngân sách dự kiến Max',
    example: 1,
  })
  @IsOptional()
  budget_max: number;

  @ApiProperty({
    required: false,
    description: 'Giới tính',
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  gender_ids: number[];

  @ApiProperty({
    required: false,
    description: 'Độ tuổi',
    enum: [1],
  })
  @IsOptional()
  age_group_id: number;

  @ApiProperty({
    required: false,
    description: 'sale phụ trách',
    example: [101, 103],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true }) // Apply IsNumber decorator to each array element
  responsible_sale_ids: number[];

  @ApiProperty({
    required: false,
    description: 'Sale triển khai',
    example: 101,
  })
  @IsOptional()
  @IsNumber()
  implementation_sale_id: number;

  @ApiProperty({
    required: false,
    description: 'status',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  status: number;
}
