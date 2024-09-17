// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
// Other dependencies
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  NotContains,
} from 'class-validator';

export class RegisterHROMiniAppDto {
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
    description: 'Số điện thoại của HRO',
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
    description: 'Mật khẩu của HRO',
    example: '123456',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống Mật khẩu của HRO',
  })
  @IsString({
    message: 'Vui lòng nhập Mật khẩu của HRO đúng định dạng chuỗi ký tự',
  })
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống Mật khẩu của HRO',
  })
  password: string;

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
    description: 'Giới tính của HRO',
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
}
