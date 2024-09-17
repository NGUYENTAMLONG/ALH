// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// Other dependencies
import {
  IsArray,
  IsEmail,
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
    example: 'https://dev.api.alehub.net/public/files/171829311034568279.xlsx',
  })
  @IsString()
  @IsNotEmpty()
  file: string;

  @ApiProperty({
    required: true,
    description: 'file_name',
    example: '171829311034568279.xlsx',
  })
  @IsString()
  @IsNotEmpty()
  file_name: string;
}

export class EnterpriseDto {
  @ApiProperty({
    required: false,
    example: 'File',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  logo?: string | null;

  @ApiProperty({
    required: true,
    description: 'Tên của công ty',
    example: 'Công ty cổ phần ABC',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống tên của công ty',
  })
  enterprise_name: string;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại chính dùng để liên hệ với doanh nghiệp',
    example: '0987654321',
  })
  @IsOptional()
  @IsString({
    message: 'Vui lòng nhập số điện thoại chính của doanh nghiệp là một chuỗi',
  })
  phone_number: string;

  @ApiProperty({
    required: true,
    description: 'Email dùng để liên hệ với công ty',
    example: 'nguyenvana@gmail.com',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống email của công ty',
  })
  @IsEmail(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng email',
    },
  )
  email: string;

  @ApiProperty({
    required: false,
    description: 'Mã thuế của doanh nghiệp',
    example: 'abcxyz',
  })
  @IsOptional()
  tax_code?: string;

  @ApiProperty({
    required: true,
    description: 'Id thành phố',
    example: '1',
  })
  @IsOptional()
  province?: number;

  @ApiProperty({
    required: false,
    description: 'Id quận/huyện',
    example: '2',
  })
  @IsOptional()
  district?: number;

  @ApiProperty({
    required: false,
    description: 'Id phường/xã',
    example: '3',
  })
  @IsOptional()
  ward?: number;

  @ApiProperty({
    required: false,
    description: 'Địa chỉ chi tiết',
    example: 'Ngõ 178',
  })
  @IsOptional()
  address: string;

  @ApiProperty({
    required: true,
    description: 'Tên người đại diện công ty',
    example: 'Nguyễn Văn A',
  })
  @IsOptional()
  manager: string;

  @ApiProperty({
    required: false,
    description: 'Chức vụ của người đại diện',
    example: 'CEO',
  })
  @IsOptional()
  position?: string;

  @ApiProperty({
    required: true,
    description: 'Mật khẩu',
    example: '123456Aa@',
  })
  @IsOptional()
  password: string;
}
export class RecruitmentDto {
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
  career_field_id: number;

  @ApiProperty({
    required: true,
    description: 'Ngành nghề tuyển dụng input',
    example: 'Công nghệ thông tin',
  })
  @IsOptional()
  career_field_input: string;

  @ApiProperty({
    required: true,
    description: 'Lĩnh vực tuyển dụng ',
    enum: [1, 2],
  })
  @IsOptional()
  professional_field_id: number;

  @ApiProperty({
    required: true,
    description: 'Lĩnh vực tuyển dụng input',
    example: 'Công nghệ thông tin',
  })
  @IsOptional()
  professional_field_input: string;

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
    description: 'Mức lương',
    example: '1',
  })
  @IsOptional()
  salary_range: number;

  @ApiProperty({
    required: true,
    description: 'Mức lương',
    example: '10.000.000 VNĐ',
  })
  @IsOptional()
  salary_range_input: string;

  @ApiProperty({
    required: true,
    description: 'Mô tả công việc',
  })
  @IsOptional()
  job_description: string;

  @ApiProperty({
    required: true,
    description: 'Phúc lợi và đãi ngộ',
  })
  @IsOptional()
  benefits_and_treatment: string;

  @ApiProperty({
    required: true,
    description: 'Giới thiệu về công ty/Yêu cầu công việc',
  })
  @IsOptional()
  enterprise_introduction: string;

  @ApiProperty({
    required: true,
    description: 'Địa điểm làm việc chi tiết',
    example: 'Địa điểm làm việc chi tiết',
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
    required: true,
    description: 'Số lượng tuyển',
  })
  @IsOptional()
  recruitment_count: number;

  @ApiProperty({
    required: true,
    description: 'Kinh nghiệm',
    enum: [1],
  })
  @IsOptional()
  years_of_experience: number;

  @ApiProperty({
    required: true,
    description:
      'Trạng thái đăng (3-Đã trong tiến trình đăng tuyển (PROCESSED) | 11-Nháp (Draft))',
    enum: [3, 11],
  })
  @IsOptional()
  status: number;
}
export class HROUpdateRecruitmentWithEnterperiseDto {
  // @ApiProperty({
  //   required: true,
  //   description: 'Trạng thái của yêu cầu tuyển dụng',
  //   example: 1,
  // })
  // @IsNumber(
  //   {},
  //   {
  //     message: 'Vui lòng nhập id số',
  //   },
  // )
  // @IsOptional()
  // status: number;

  @ApiProperty({
    required: true,
    description: 'Id Tin tuyển dụng',
    example: '1',
  })
  @IsNotEmpty({ message: 'Thông tin id tin tuyển dụng là bắt buộc' })
  recruitment_requirement_id: number;

  @ApiProperty({
    required: true,
  })
  @Type(() => EnterpriseDto)
  @IsOptional()
  enterprise: EnterpriseDto;

  @ApiProperty({
    required: true,
  })
  @Type(() => RecruitmentDto)
  @IsOptional()
  recruitment: RecruitmentDto;
}

export class RecruitmentRequirementDto {
  @ApiProperty({
    required: true,
    description: 'Id Công ty/Doanh nghiệp',
    example: '1',
  })
  @IsNotEmpty({ message: 'Thông tin id tin tuyển dụng là bắt buộc' })
  recruitment_requirement_id: number;
}
