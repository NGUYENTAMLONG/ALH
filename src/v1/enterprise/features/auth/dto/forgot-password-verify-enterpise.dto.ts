// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  NotContains,
} from 'class-validator';

export class ForgotPasswordVerifyEnterpriseDto {
  @ApiProperty({
    required: true,
    example: 1,
  })
  @IsNumber(
    {},
    {
      message: 'Vui lòng nhập id số',
    },
  )
  @Min(1, {
    message: 'Id đăng nhập là số lớn hơn 0',
  })
  id: number;

  @ApiProperty({
    required: true,
    example: 'abcxyz',
  })
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống mã xác thực',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống mã xác thực',
  })
  @IsString({
    message: 'Vui lòng nhập mã là một chuỗi ký tự',
  })
  forgot_password_code: string;

  @ApiProperty({
    required: true,
    example: '123456789',
  })
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống mật khẩu xác thực',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống mật khẩu xác thực',
  })
  @IsString({
    message: 'Vui lòng nhập mật khẩu xác thực là một chuỗi ký tự',
  })
  confirm_password: string;

  @ApiProperty({
    required: true,
    example: '123456789',
  })
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống mật khẩu',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống mật khẩu',
  })
  @IsString({
    message: 'Vui lòng nhập mật khẩu là một chuỗi ký tự',
  })
  password: string;
}
