// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsNotEmpty, IsString, NotContains } from 'class-validator';

export class CandidateLoginDto {
  @ApiProperty({
    required: true,
    example: '0987654322 or candidate@gmail.com',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống số điện thoại hoặc email',
  })
  // @Matches(/^(?:\d{10,13}|\w+@\w+\.\w{2,3})$/, {
  //   message: 'Vui lòng nhập đúng định dạng là số điện hoại hoặc email',
  // })
  account: string;

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
