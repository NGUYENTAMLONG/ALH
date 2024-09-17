// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEnterPriseHroDto {
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
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống số điện thoại chính của doanh nghiệp',
  })
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
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống tên người đại diện của công ty',
  })
  manager: string;

  @ApiProperty({
    required: false,
    description: 'Chức vụ của người đại diện',
    example: 'CEO',
  })
  @IsOptional()
  position?: string;

  @ApiProperty({
    required: true,
    description: 'Mật khẩu',
    example: '123456Aa@',
  })
  @IsOptional()
  password: string;
}
