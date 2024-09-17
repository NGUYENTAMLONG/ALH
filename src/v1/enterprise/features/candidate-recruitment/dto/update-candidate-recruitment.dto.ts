// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
// Other dependencies
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
// Local files
import { CANDIDATE_RECRUITMENT_STATUS } from '@utils/constants';

export class EnterpriseUpdateCandidateRecruitmentDto {
  @ApiProperty({
    required: true,
    description: 'Trạng thái của ứng viên',
    enum: CANDIDATE_RECRUITMENT_STATUS,
  })
  @IsNotEmpty()
  @IsNumber()
  status: number;

  @ApiProperty({
    required: true,
    description: 'Ghi chú của ứng viên',
    example: 'Okee',
  })
  @IsOptional()
  @IsString()
  note: string;
}
