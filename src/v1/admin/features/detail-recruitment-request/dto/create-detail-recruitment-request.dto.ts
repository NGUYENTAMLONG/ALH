// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
//Other files
import { IsNumber } from 'class-validator';

export class AdminCreateDetailRecruitmentRequestDto {
  @ApiProperty({
    required: true,
    description: 'id của ứng viên',
    example: 2,
  })
  @IsNumber()
  candidate_information_id: number;

  @ApiProperty({
    required: true,
    description: 'id của doanh nghiệp',
    example: 2,
  })
  @IsNumber()
  enterprise_id: number;
}
