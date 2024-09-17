// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  NotContains,
} from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({
    required: true,
    description: 'Số điện thoại của ứng viên',
    example: '0867452194',
  })
  // @IsNotEmpty({
  //   message: 'Vui lòng không bỏ trống Số điện thoại',
  // })
  @IsOptional({})
  @IsString({
    message: 'Vui lòng nhập Số điện thoại đúng định dạng chuỗi ký tự',
  })
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống Số điện thoại',
  })
  phone_number: string;

  @ApiProperty({
    required: true,
    example: 'admin@gmail.com',
  })
  // @IsNotEmpty({
  //   message: 'Vui lòng không bỏ trống email',
  // })
  @IsOptional({})
  @IsString({
    message: 'Vui lòng nhập email đúng định dạng chuỗi ký tự',
  })
  @IsEmail(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng email',
    },
  )
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống email',
  })
  email: string;

  @ApiProperty({
    required: true,
    example: '123456',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống mật khẩu',
  })
  @IsString({
    message: 'Vui lòng nhập mật khẩu đúng định dạng chuỗi ký tự',
  })
  password: string;
}
