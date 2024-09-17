// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteEnterPriseAdminDto {
  @ApiProperty({
    required: true,
    description: 'id của công ty',
    example: [1, 2],
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống id của công ty',
  })
  @IsArray()
  @IsNumber({}, { each: true, message: 'Vui lòng nhập id là số' })
  ids: string;
}
