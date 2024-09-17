// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
// Other dependencies
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AdminDeleteCandidateDto {
  @ApiProperty({
    required: true,
    description: 'ids của ứng viên',
    example: [1, 2],
  })
  @IsNotEmpty()
  @IsArray({ message: 'Vui lòng nhập một mảng' })
  @IsNumber({}, { each: true, message: 'Vui lòng nhập id là số' }) // Apply IsNumber decorator to each array element
  ids: number[];
}
