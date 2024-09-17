// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsNotEmpty, IsString, NotContains } from 'class-validator';

export class ChangePasswordHRODto {
  @ApiProperty({
    required: true,
    example: '123456789',
  })
  @NotContains(' ')
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
  @NotContains(' ')
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống mật khẩu',
  })
  @IsString({
    message: 'Vui lòng nhập mật khẩu là một chuỗi ký tự',
  })
  password: string;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại của người đăng ký',
    example: '0987654333',
  })
  @IsNotEmpty({ message: 'Vui lòng không bỏ trống số điện thoại' })
  phone_number: string;
}
