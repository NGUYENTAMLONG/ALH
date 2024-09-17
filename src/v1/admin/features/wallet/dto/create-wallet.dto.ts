import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AdminCreateWalletDto {
  @ApiProperty({
    required: true,
    description: 'Id cuar user',
    example: 150,
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống Id cuar user',
  })
  user_id: number;

  @ApiProperty({
    required: true,
    description: 'Số tiền của cty',
    example: 10000000,
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống Số tiền của cty',
  })
  @IsNumber()
  balance: number;
}
