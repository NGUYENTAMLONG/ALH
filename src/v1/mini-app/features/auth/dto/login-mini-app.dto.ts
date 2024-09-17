// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  NotContains,
} from 'class-validator';

export class LoginMiniAppDto {
  @ApiProperty({
    required: true,
    description: 'Số điện thoại của người dùng',
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
    required: false,
    description: 'Ảnh của user',
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
    description: 'Vai trò người dùng',
    example: '6',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống vai trò',
  })
  @IsNumber()
  role_id: number;
}

export class LoginByQRDto {
  @ApiProperty({
    required: true,
    description: 'Số điện thoại của người dùng',
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
    description: 'Vai trò người dùng',
    example: '6',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống vai trò',
  })
  @IsString()
  role_id: string;

  @ApiProperty({
    required: true,
    description: 'Thông tin socket của web người dùng cần đăng nhập',
    example: 'LKDsOmeVaq1qRXwLAAAD',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống thông tin socket',
  })
  @IsString({
    message: 'Vui lòng thêm thông tin socket đúng định dạng chuỗi ký tự',
  })
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống Socket id',
  })
  socket_id: string;
}
