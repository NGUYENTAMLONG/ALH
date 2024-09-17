// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
// Other dependencies
import { IsNotEmpty, IsNumber } from 'class-validator';
// Local files
import { CANDIDATE_RECRUITMENT_STATUS } from '@utils/constants';

export class AdminUpdateCandidateHireRequirementDto {
  @ApiProperty({
    required: true,
    description: 'Trạng thái của ứng viên',
    enum: CANDIDATE_RECRUITMENT_STATUS,
  })
  @IsNotEmpty()
  @IsNumber()
  status: number;
}
