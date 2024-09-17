import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AdminUpdateWalletDto {
  @ApiProperty({
    required: true,
    description: 'Số tiền của cty',
    example: 10000000,
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống Số tiền của cty',
  })
  @IsNumber()
  value: number;

  @ApiProperty({
    required: true,
    description: 'Loại 1: Cộng, 2: Trừ',
    example: 1,
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống Số tiền của cty',
  })
  @IsNumber()
  type: number;

  @ApiProperty({
    required: true,
    description: 'Ghi chú',
    example: 1,
  })
  @IsOptional()
  @IsString()
  note: string;
}
