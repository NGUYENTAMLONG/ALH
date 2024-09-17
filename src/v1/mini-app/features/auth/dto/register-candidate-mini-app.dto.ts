// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
// Other dependencies
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  NotContains,
} from 'class-validator';

export class RegisterCandidateMiniAppDto {
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

  @ApiProperty({
    required: true,
    description: 'Số điện thoại của ứng vên',
    example: '0867452194',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống Số điện thoại',
  })
  @IsString({
    message: 'Vui lòng nhập Số điện thoại đúng định dạng chuỗi ký tự',
  })
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống Số điện thoại',
  })
  phone_number: string;

  @ApiProperty({
    required: true,
    description: 'Mật khẩu của ứng vên',
    example: '123456',
  })
  @IsOptional()
  @IsString({
    message: 'Vui lòng nhập Mật khẩu của ứng vên đúng định dạng chuỗi ký tự',
  })
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống Mật khẩu của ứng vên',
  })
  password?: string;

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
    required: false,
    description: 'Giới tính của ứng vên',
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
    description: 'Vai trò người dùng',
    example: '6',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống vai trò',
  })
  @IsNumber()
  role_id: number;
}
