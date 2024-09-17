// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordHRODto {
  @ApiProperty({
    required: true,
    description: 'Số điện thoại của người đăng ký',
    example: '0987654333',
  })
  @IsNotEmpty({ message: 'Vui lòng không bỏ trống số điện thoại' })
  phone_number: string;
}
