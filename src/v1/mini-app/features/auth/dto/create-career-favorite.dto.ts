// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateCareerFavoriteDto {
  @ApiProperty({
    required: true,
    description: 'Nghề nghiệp mà user quan tâm',
    example: [101, 103],
  })
  @IsOptional()
  @IsArray({ message: 'Vui lòng nhập một mảng' })
  @IsNumber({}, { each: true, message: 'Vui lòng nhập id của nghề nghiệp' })
  df_career_ids: number[];
}
