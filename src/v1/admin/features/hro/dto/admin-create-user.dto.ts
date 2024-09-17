// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
// Other dependencies
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  NotContains,
} from 'class-validator';

export class AdminCreateHROUserDto {
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
    description: 'Số điện thoại của ứng viên',
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
    description: 'Mật khẩu của ứng viên',
    example: '123456',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống Mật khẩu của ứng viên',
  })
  @IsString({
    message: 'Vui lòng nhập Mật khẩu của ứng viên đúng định dạng chuỗi ký tự',
  })
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống Mật khẩu của ứng viên',
  })
  password: string;

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
    description: 'Số điện thoại thay thế',
    example: '0867452194',
  })
  @IsString()
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống Số điện thoại',
  })
  @IsOptional()
  alternate_phone: string;

  @ApiProperty({
    required: false,
    description: 'Giới tính của ứng viên',
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
    description: ' ảnh của user',
    example: 'public/image/dghshjfdjslkdldfsld.jpg',
  })
  @IsOptional()
  @IsString()
  avatar: string;

  @ApiProperty({
    required: false,
    description: ' bank_id',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  bank_id: number;

  @ApiProperty({
    required: false,
    description: 'Số tài khoản',
    example: '18387934535546',
  })
  @IsOptional()
  @IsString()
  account_number: string;

  @ApiProperty({
    required: false,
    description: 'Người thụ hưởng',
    example: 'Nguyễn Thu Hồng',
  })
  @IsOptional()
  @IsString()
  cardholder_name: string;
}
