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

export class UpdateAccountInformationDto {
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
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống Họ và tên',
  })
  @IsString({
    message: 'Vui lòng nhập Họ và tên đúng định dạng chuỗi ký tự',
  })
  full_name: string;

  //Không cập nhật sđt
  // @ApiProperty({
  //   required: true,
  //   description: 'Số điện thoại của HRO',
  //   example: '0867452194',
  // })
  // @IsNotEmpty({
  //   message: 'Vui lòng không bỏ trống Số điện thoại',
  // })
  // @IsString({
  //   message: 'Vui lòng nhập Số điện thoại đúng định dạng chuỗi ký tự',
  // })
  // @NotContains(' ', {
  //   message: 'Vui lòng không bỏ trống Số điện thoại',
  // })
  // phone_number: string;

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
  @NotContains(' ', {
    message: 'Email không bao gồm khoảng trống',
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
    required: false,
    description: 'Giới tính của user',
    example: 1,
  })
  @IsNumber(
    {},
    {
      message: 'Vui lòng nhập gender_id là số',
    },
  )
  @IsOptional()
  gender_id: number;

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
    required: true,
    description: 'Mảng các file sẽ xoá',
    example: [101, 103],
  })
  @IsOptional()
  @IsArray({ message: 'Vui lòng nhập một mảng' })
  @IsNumber({}, { each: true, message: 'Vui lòng nhập id của file' })
  delete_file_ids: number[];
}

export class UpdateEnterpriseInformationDto {
  @ApiProperty({
    required: true,
    description: 'Id công ty doanh nghiệp',
    example: '1',
  })
  @IsOptional()
  enterprise_id?: number;

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
}
