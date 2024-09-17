// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
// Other dependencies
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  NotContains,
  ValidateNested,
} from 'class-validator';

class CreateWorkExperience {
  @ApiProperty({
    required: true,
    description: 'Tên doanh nghiệp',
    example: 'cty WS',
  })
  @IsOptional()
  @IsString({
    message: 'Vui lòng nhập Tên doanh nghiệp đúng định dạng chuỗi ký tự',
  })
  enterprise_name: string;

  @ApiProperty({
    required: true,
    description: 'Vị trí công việc',
    example: 'nhân viên sale',
  })
  @IsString({
    message: 'Vui lòng nhập Vị trí công việc đúng định dạng chuỗi ký tự',
  })
  @IsOptional()
  position: string;

  @ApiProperty({
    required: false,
    description: 'Thời gian bắt đầu',
    example: '2022-01-01',
  })
  @IsString({
    message: 'Vui lòng nhập Thời gian bắt đầu đúng định dạng chuỗi ký tự',
  })
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  @IsOptional()
  start_time: Date;

  @ApiProperty({
    required: false,
    description: 'Thời gian kết thúc',
    example: '2022-09-01',
  })
  @IsString({
    message: 'Vui lòng nhập Thời gian bắt đầu đúng định dạng chuỗi ký tự',
  })
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  @IsOptional()
  end_time: Date;

  @ApiProperty({
    required: false,
    description: 'Mô tả',
    example: 'làm việc tốt',
  })
  @IsString({
    message: 'Vui lòng nhập Mô tả đúng định dạng chuỗi ký tự',
  })
  @IsOptional()
  description: string;
}

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
export class AdminUpdateCandidateDto {
  @ApiProperty({
    required: true,
    description: 'Họ và tên của ứng viên',
    example: 'Tran Van A',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống Họ và tên',
  })
  @IsString({
    message: 'Vui lòng nhập Họ và tên đúng định dạng chuỗi ký tự',
  })
  full_name: string;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại của ứng viên',
    example: '0867452194',
  })
  @IsOptional()
  @IsString({
    message: 'Vui lòng nhập Số điện thoại đúng định dạng chuỗi ký tự',
  })
  phone_number: string;

  @ApiProperty({
    required: false,
    example: '2023-08-01',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  date_of_birth: Date;

  @ApiProperty({
    required: false,
    example: 'a@gmail.com',
  })
  @IsString({
    message: 'Vui lòng nhập email đúng định dạng chuỗi ký tự',
  })
  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng email',
    },
  )
  email: string;

  @ApiProperty({
    required: true,
    description: 'Ứng viên tuyển',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  is_recruitment: number;

  @ApiProperty({
    required: true,
    description: 'all province',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  is_all_province: number;

  @ApiProperty({
    required: true,
    description: 'Ứng viên thuê',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  is_hire: number;

  @ApiProperty({
    required: true,
    description: 'Vị trí công việc của ứng viên',
    example: '1',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống Vị trí công việc của ứng viên',
  })
  @IsString()
  professional_field: string;

  @ApiProperty({
    required: false,
    description: 'Kỹ năng chuyên môn',
    example: 'Thành thạo Word, Excel, Powerpoint',
  })
  @IsOptional()
  skill_input: string;

  @ApiProperty({
    required: false,
    example: 'ứng viên tốt',
  })
  @IsString({
    message: 'Vui lòng nhập đúng định dạng chuỗi ký tự note',
  })
  @IsOptional()
  note: string;

  @ApiProperty({
    required: true,
    description: 'Mức lương mong muốn của ứng viên',
    example: '1',
  })
  @IsOptional()
  @IsNumber()
  salary_range_id: number;

  @ApiProperty({
    required: true,
    description: 'Giá thuê của ứng viên',
    example: [10000000],
  })
  @IsOptional()
  @IsArray({ message: 'Vui lòng nhập một mảng' })
  @IsNumber({}, { each: true, message: 'Vui lòng nhập giá thuê là số' }) // Apply IsNumber decorator to each array element
  salary: number[];

  @ApiProperty({
    required: true,
    description: 'Địa điểm làm việc của ứng viên',
    example: [101, 103],
  })
  @IsOptional()
  @IsArray({ message: 'Vui lòng nhập một mảng' })
  @IsNumber({}, { each: true, message: 'Vui lòng nhập id của địa điểm' })
  df_province_ids: number[];

  @ApiProperty({
    required: true,
    description: 'Số năm kinh nghiệm của ứng viên',
    example: '1',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống Số năm kinh nghiệm của ứng viên',
  })
  @IsNumber(
    {},
    {
      message: 'Vui lòng nhập số years_of_experience_id',
    },
  )
  years_of_experience_id: number;

  @ApiProperty({
    required: true,
    description: 'Hình thức làm việc của ứng viên',
    example: '1',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống Hình thức làm việc của ứng viên',
  })
  @IsArray({ message: 'Vui lòng nhập một mảng job_type_ids' })
  @IsNumber({}, { each: true, message: 'Vui lòng nhập id của job_type_ids' })
  job_type_ids: number[];

  @ApiProperty({
    required: false,
    description: 'Giới tính của ứng viên',
    example: '1',
  })
  @IsNumber(
    {},
    {
      message: 'Vui lòng nhập số gender_id',
    },
  )
  @IsOptional()
  gender_id: number;

  @ApiProperty({
    required: false,
    description: 'file ảnh của ứng viên',
    example: ['public/image/dghshjfdjslkdldfsld.jpg'],
  })
  @IsArray({ message: 'Vui lòng nhập một mảng' })
  @IsOptional()
  @IsString({
    each: true,
    message: 'Vui lòng nhập đúng định dạng chuỗi ký tự image file',
  })
  image_files: string[];

  @ApiProperty({
    required: false,
    description: 'file ghi âm thử giọng của ứng viên',
    example: 'public/file/dghshjfdjslkdldfsld.mp3',
  })
  @IsString({
    message: 'Vui lòng nhập đúng định dạng chuỗi ký tự voice_recording',
  })
  @IsOptional()
  voice_recording: string;

  @ApiProperty({
    required: false,
    description: 'file video của ứng viên',
    example: 'public/file/dghshjfdjslkdldfsld.mp3',
  })
  @IsString({
    message: 'Vui lòng nhập đúng định dạng chuỗi ký tự video file',
  })
  @IsOptional()
  video_file: string;

  @ApiProperty({
    required: false,
    description: 'Tệp đính kèm của ứng viên',
    example: '{"file":"sssssssssssss", "file_name":"aaaaaaaaaaaaaaaa"}',
  })
  @IsArray({ message: 'Vui lòng nhập một mảng' })
  @ValidateNested()
  @Type(() => FormJdUpload)
  @IsOptional()
  files: FormJdUpload[];

  @ApiProperty({
    required: false,
    description: 'Mật khẩu của ứng viên',
    example: '123456',
  })
  @IsString({
    message: 'Vui lòng nhập đúng định dạng chuỗi ký tự password',
  })
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống mật khẩu',
  })
  @IsOptional()
  password: string;

  @ApiProperty({
    required: false,
    description: 'Kinh nghiệm làm việc của ứng viên',
    example: [
      {
        enterprise_name: 'cty alpha',
        position: 'nhân viên kinh doanh',
        start_time: '2022-01-01',
        end_time: '2022-09-01',
        description: 'làm việc doanh số cao',
      },
    ],
  })
  @IsArray({ message: 'Vui lòng nhập một mảng' })
  @ValidateNested()
  @Type(() => CreateWorkExperience)
  @IsOptional()
  work_experiences: CreateWorkExperience[];

  @ApiProperty({
    required: true,
    description: 'Loại công việc theo cuộc gọi',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  type_on_call: number;

  @ApiProperty({
    required: true,
    description: 'Loại công việc theo giờ',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  type_on_hour: number;

  @ApiProperty({
    required: true,
    description: 'Giá thuê min',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  budget_min: number;

  @ApiProperty({
    required: true,
    description: 'Giá thuê max',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  budget_max: number;

  //Update interest
  @ApiProperty({
    required: true,
    description: 'Nghề nghiệp mà user quan tâm',
    example: [101, 103],
  })
  @IsOptional()
  @IsArray({ message: 'Vui lòng nhập một mảng' })
  @IsNumber({}, { each: true, message: 'Vui lòng nhập id của nghề nghiệp' })
  career_ids: number[];

  @ApiProperty({
    required: true,
    description: 'Id chức vụ quan tâm',
    example: '1',
  })
  @IsOptional()
  position_id?: number;

  @ApiProperty({
    required: true,
    description: 'Id bằng cấp',
    example: '1',
  })
  @IsOptional()
  degree_id?: number;

  @ApiProperty({
    required: false,
    description: 'Trạng thái của ứng viên',
    example: 1,
  })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'Vui lòng nhập id số',
    },
  )
  status?: number;
}
