import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePositionDto {
  @ApiProperty({
    required: true,
    description: 'Tên chức vụ',
    example: 'CEO',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống tên chức vụ',
  })
  name: string;
}
