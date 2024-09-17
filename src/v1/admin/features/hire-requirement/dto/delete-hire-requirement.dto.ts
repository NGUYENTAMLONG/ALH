// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsOptional } from 'class-validator';

export class AdminDeleteHireRequirementDto {
  @ApiProperty({
    required: true,
    description: 'id của yêu cầu',
    example: [1, 2, 3],
  })
  @IsOptional()
  ids: number[];
}
