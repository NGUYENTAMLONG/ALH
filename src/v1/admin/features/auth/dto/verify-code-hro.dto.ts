// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsNotEmpty } from 'class-validator';

export class VerifyCodeHRODto {
  @ApiProperty({
    required: true,
    description: 'Mã code của user',
    example: '098765433386839sd',
  })
  @IsNotEmpty({ message: 'Vui lòng không bỏ trống mã code' })
  code: string;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại của người đăng ký',
    example: '0987654333',
  })
  @IsNotEmpty({ message: 'Vui lòng không bỏ trống số điện thoại' })
  phone_number: string;
}
