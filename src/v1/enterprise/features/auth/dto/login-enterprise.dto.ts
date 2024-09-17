// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsNotEmpty, IsString } from 'class-validator';

export class EnterpriseLoginDto {
  @ApiProperty({
    required: true,
    example: '0987654322 or admin@gmail.com',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống số điện thoại hoặc email',
  })
  // @Matches(/^(?:\d{10,13}|\w+@\w+\.\w{2,3})$/, {
  //   message: 'Vui lòng nhập đúng định dạng là số điện hoại hoặc email',
  // })
  phone_number: string;

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
