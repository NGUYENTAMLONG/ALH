import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AdminUpdateUserPointDto {
  @ApiProperty({
    required: true,
    description: 'Số tiền',
    example: 10000000,
  })
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @ApiProperty({
    required: true,
    description: 'Loại 1: Cộng, 2: Trừ',
    example: 1,
  })
  @IsNotEmpty()
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
