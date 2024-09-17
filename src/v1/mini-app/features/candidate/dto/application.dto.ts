// Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { RECRUITMENT_STATUS } from '@utils/constants';
import { Type } from 'class-transformer';

// Other dependencies
import {
  IsArray,
  IsBoolean,
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
  @IsString({
    message: 'Vui lòng nhập Tên doanh nghiệp đúng định dạng chuỗi ký tự',
  })
  @IsOptional()
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
    required: true,
    description: 'Thời gian bắt đầu',
    example: '2022-01-01',
  })
  @IsString({
    message: 'Vui lòng nhập Thời gian bắt đầu đúng định dạng chuỗi ký tự',
  })
  @IsDateString(
    {},
    {
      message:
        'Vui lòng nhập đúng định dạng thời gian start_time DV: 2023-08-01',
    },
  )
  @IsOptional()
  start_time: Date;

  @ApiProperty({
    required: true,
    description: 'Thời gian kết thúc',
    example: '2022-09-01',
  })
  @IsString({
    message: 'Vui lòng nhập Thời gian bắt đầu đúng định dạng chuỗi ký tự',
  })
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian end_time DV: 2023-08-01',
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

class CreateEducationExperience {
  @ApiProperty({
    required: false,
    description: 'Tên trung tâm giáo dục, trường học',
    example: 'Đại học Bách Khoa Hà Nội',
  })
  @IsString({
    message:
      'Vui lòng nhập tên trường, trung tâm giáo dục đúng định dạng chuỗi ký tự',
  })
  @IsOptional()
  school_name: string;

  @ApiProperty({
    required: false,
    description: 'Chuyên môn học tập',
    example: 'Công nghệ thông tin',
  })
  @IsString({
    message: 'Vui lòng nhập chuyên môn học tập đúng định dạng chuỗi ký tự',
  })
  @IsOptional()
  major: string;

  @ApiProperty({
    required: false,
    description: 'Mô tả quá trình học tập (nếu có)',
    example: 'Quá trình học tập rèn luyện',
  })
  @IsString({
    message: 'Vui lòng nhập mô tả đúng định dạng chuỗi ký tự',
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    required: true,
    description: 'Thời gian bắt đầu',
    example: '2022-01-01',
  })
  @IsString({
    message: 'Vui lòng nhập Thời gian bắt đầu đúng định dạng chuỗi ký tự',
  })
  @IsDateString(
    {},
    {
      message:
        'Vui lòng nhập đúng định dạng thời gian start_time DV: 2023-08-01',
    },
  )
  @IsOptional()
  start_time: Date;

  @ApiProperty({
    required: true,
    description: 'Thời gian kết thúc',
    example: '2022-09-01',
  })
  @IsString({
    message: 'Vui lòng nhập Thời gian bắt đầu đúng định dạng chuỗi ký tự',
  })
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian end_time DV: 2023-08-01',
    },
  )
  @IsOptional()
  end_time: Date;
}

class CreateSkillExperience {
  @ApiProperty({
    required: false,
    description: 'Tên kỹ năng',
    example: 'Tin học văn phòng',
  })
  @IsString({
    message: 'Vui lòng nhập tên kỹ năng đúng định dạng chuỗi ký tự',
  })
  @IsOptional()
  skill_name: string;

  @ApiProperty({
    required: false,
    description: 'Đánh giá kỹ năng (1-5) bước nhảy 0.5',
    example: 4.5,
  })
  @IsNumber()
  @IsOptional()
  rating: number;

  @ApiProperty({
    required: false,
    description: 'Mô tả kỹ năng (nếu có)',
    example: 'Kỹ năng đã có chứng chỉ',
  })
  @IsString({
    message: 'Vui lòng nhập mô tả kỹ năng đúng định dạng chuỗi ký tự',
  })
  @IsOptional()
  description: string;
}

class CreateReferrer {
  @ApiProperty({
    required: false,
    description: 'Họ và tên',
    example: 'Tran Van A',
  })
  @IsString({
    message: 'Vui lòng nhập Họ và tên đúng định dạng chuỗi ký tự',
  })
  @IsOptional()
  full_name: string;

  @ApiProperty({
    required: false,
    description: 'Số điện thoại của ứng vên',
    example: '0867452194',
  })
  @IsOptional()
  @IsString({
    message: 'Vui lòng nhập Số điện thoại đúng định dạng chuỗi ký tự',
  })
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống Số điện thoại',
  })
  phone_number: string;

  @ApiProperty({
    required: false,
    example: 'a@gmail.com',
  })
  @IsString({
    message: 'Vui lòng nhập email đúng định dạng chuỗi ký tự',
  })
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống email',
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
    description: 'Vị trí của người giới thiệu',
    example: 'CEO công ty ABC',
  })
  @IsOptional()
  position_input: string;
}

export class CreateApplicationDto {
  @ApiProperty({
    required: false,
    description: ' Tên của hồ sơ',
  })
  @IsOptional()
  @IsString()
  application_name: string;

  @ApiProperty({
    required: false,
    description: ' ảnh của user',
    example: 'public/image/dghshjfdjslkdldfsld.jpg',
  })
  @IsOptional()
  @IsString()
  avatar: string;

  @ApiProperty({
    required: true,
    description: 'Họ và tên',
    example: 'Tran Van A',
  })
  // @IsNotEmpty({
  //   message: 'Vui lòng không bỏ trống Họ và tên',
  // })
  @IsString({
    message: 'Vui lòng nhập Họ và tên đúng định dạng chuỗi ký tự',
  })
  @IsOptional()
  full_name: string;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại của ứng vên',
    example: '0867452194',
  })
  // @IsNotEmpty({
  //   message: 'Vui lòng không bỏ trống Số điện thoại',
  // })
  @IsOptional()
  @IsString({
    message: 'Vui lòng nhập Số điện thoại đúng định dạng chuỗi ký tự',
  })
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống Số điện thoại',
  })
  phone_number: string;

  @ApiProperty({
    required: false,
    example: 'a@gmail.com',
  })
  @IsString({
    message: 'Vui lòng nhập email đúng định dạng chuỗi ký tự',
  })
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống email',
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
    description: 'Giới tính',
  })
  @IsOptional()
  gender_id: number;

  @ApiProperty({
    required: false,
    description: 'Địa chỉ chi tiết',
    example: 'Ngõ 178',
  })
  @IsOptional()
  address: string;

  @ApiProperty({
    required: false,
    description: 'Trình độ học vấn',
    example: 'Tốt nghiệp THPT',
  })
  @IsOptional()
  education: string;

  @ApiProperty({
    required: false,
    description: 'Kỹ năng chuyên môn',
    example: 'Thành thạo Word, Excel, Powerpoint',
  })
  @IsOptional()
  skill_input: string;

  @ApiProperty({
    required: false,
    description: 'Mục tiêu sự nghiệp',
    example: 'Mục tiêu sự nghiệp',
  })
  @IsOptional()
  career_goals: string;

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
    description: 'Vị trí tuyển dụng quan tâm input',
    example: 'CEO',
  })
  @IsOptional()
  position_input: string;

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
    required: true,
    description: 'Bằng cấp cao nhất',
  })
  @IsOptional()
  degree_id: number;

  @ApiProperty({
    required: true,
    description: 'Kinh nghiệm làm việc',
  })
  @IsOptional()
  year_of_experience_id: number;

  @ApiProperty({
    required: true,
    description: 'Vị trí tuyển dụng ',
  })
  @IsOptional()
  position_id: number;

  @ApiProperty({
    required: true,
    description: 'Mức lương mong muốn',
  })
  @IsOptional()
  salary_range_id: number;

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
    description: 'Khu vực làm việc',
    example: [101, 103],
  })
  @IsOptional()
  @IsArray({ message: 'Vui lòng nhập khu vực là một mảng' })
  @IsNumber({}, { each: true, message: 'Vui lòng nhập id của khu vực là số' }) // Apply IsNumber decorator to each array element
  province_ids: number[];

  @ApiProperty({
    required: false,
    description: 'Hình thức làm việc của ứng viên',
    example: [1, 2],
  })
  @IsOptional()
  @IsArray({ message: 'Vui lòng nhập một mảng job_type_ids' })
  @IsNumber({}, { each: true, message: 'Vui lòng nhập id của job_type_ids' })
  job_type_ids: number[];

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
    required: false,
    description: 'Học tập của ứng viên',
    example: [
      {
        school_name: 'Trường đại học Bách Khoa Hà Nội',
        major: 'Công nghệ phần mềm',
        start_time: '2022-01-01',
        end_time: '2022-09-01',
        description: 'Kinh nghiệm chuyên môn + Kỹ năng mềm đã được rèn luyện',
      },
    ],
  })
  @IsArray({ message: 'Vui lòng nhập một mảng' })
  @ValidateNested()
  @Type(() => CreateEducationExperience)
  @IsOptional()
  education_experiences: CreateEducationExperience[];

  @ApiProperty({
    required: false,
    description: 'Trình độ, kỹ năng của ứng viên',
    example: [
      {
        skill_name: 'Ngoại ngữ',
        rating: 3.5,
        description: 'Có chứng chỉ IELTS',
      },
    ],
  })
  @IsArray({ message: 'Vui lòng nhập một mảng' })
  @ValidateNested()
  @Type(() => CreateSkillExperience)
  @IsOptional()
  skill_experiences: CreateSkillExperience[];

  @ApiProperty({
    required: false,
    description: 'Thông tin người giới thiệu',
    example: {
      full_name: 'Nguyễn Văn C',
      phone_number: '0985009876',
      email: 'vanc@gmail.com',
      position_input: 'Giám đốc cty THHH ABC',
    },
  })
  @Type(() => CreateReferrer)
  @IsOptional()
  referrer: CreateReferrer;

  @ApiProperty({
    required: true,
    description: 'đánh dấu là hồ sơ chính',
  })
  @IsOptional()
  is_main: number;
}

export class UpdateApplicationDto extends CreateApplicationDto {
  @ApiProperty({
    required: true,
    description: 'Id Hồ sơ',
  })
  @IsNotEmpty({
    message: 'Vui lòng nhập id của hồ sơ cần cập nhật',
  })
  application_id: number;
}

export class DeleteApplicationDto {
  @ApiProperty({
    required: true,
    description: 'Id Hồ sơ',
  })
  @IsNotEmpty({
    message: 'Vui lòng nhập id của hồ sơ cần cập nhật',
  })
  application_id: number;
}

export class EditApplicationNameDto {
  @ApiProperty({
    required: true,
    description: 'Id Hồ sơ',
  })
  @IsNotEmpty({
    message: 'Vui lòng nhập id của hồ sơ cần cập nhật',
  })
  application_id: number;

  @ApiProperty({
    required: true,
    description: 'Tên hồ sơ',
    example: 'Hồ sơ ứng tuyển số 1',
  })
  @IsOptional()
  application_name: string;
}
export class ApplicationIdDto {
  @ApiProperty({
    required: true,
    description: 'Id Hồ sơ',
  })
  @IsNotEmpty({
    message: 'Vui lòng nhập id của hồ sơ cần cập nhật',
  })
  application_id: number;
}

export class ChangeCVNameDto {
  @ApiProperty({
    required: true,
    description: 'Id Hồ sơ',
  })
  @IsNotEmpty({
    message: 'Vui lòng nhập id của hồ sơ cần cập nhật',
  })
  cv_file_id: number;

  @ApiProperty({
    required: true,
    description: 'file_name',
    example: 'new_name.pdf',
  })
  @IsString()
  @IsNotEmpty()
  file_name: string;
}

export class UpdateWorkExperienceDto {
  @ApiProperty({
    required: true,
    description: 'Id Hồ sơ',
  })
  @IsNotEmpty({
    message: 'Vui lòng nhập id của hồ sơ cần cập nhật',
  })
  application_id: number;

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
}

export class updateCVFileDto {
  @ApiProperty({
    required: true,
    description: 'Id Hồ sơ',
  })
  @IsNotEmpty({
    message: 'Vui lòng nhập id của hồ sơ cần cập nhật',
  })
  application_id: number;

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

export class FileCVUpload {
  @ApiProperty({
    required: true,
    description: 'Id thông tin ứng viên',
    example: '1',
  })
  @IsNotEmpty({ message: 'Id thông tin ứng viên là bắt buộc' })
  candidate_information_id: number;

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
