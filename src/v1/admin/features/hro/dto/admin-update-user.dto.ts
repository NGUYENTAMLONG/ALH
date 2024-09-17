// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
// Other dependencies
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AdminUpdateHROUserDto {
  @ApiProperty({
    required: false,
    description: 'trạng thái ',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  status: number;

  @ApiProperty({
    required: false,
    description: 'id của user',
    example: [101, 102],
  })
  @IsArray()
  @IsNumber(
    {},
    { each: true, message: 'Vui lòng nhập id của yêu cầu đăng ký hro' },
  )
  @IsNotEmpty()
  ids: number[];
}
