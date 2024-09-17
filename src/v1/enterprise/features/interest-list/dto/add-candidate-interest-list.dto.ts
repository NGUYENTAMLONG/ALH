import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class EnterpriseAddCandidateInterestListDto {
  @ApiProperty({
    required: true,
    description: 'id của ứng viên',
    example: 7,
  })
  @IsNotEmpty()
  @IsNumber()
  candidate_id: number;
}
