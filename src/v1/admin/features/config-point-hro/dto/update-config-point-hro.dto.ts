// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsNotEmpty } from 'class-validator';

export class UpdateConfigPointHroDto {
  @ApiProperty({
    required: true,
    description: 'Điểm',
    example: 1000,
  })
  @IsNotEmpty()
  point: number;
}
