// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
// Other dependencies
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
// Local files
import { CANDIDATE_RECRUITMENT_STATUS } from '@utils/constants';

export class AdminUpdateCandidateRecruitmentDto {
  @ApiProperty({
    required: true,
    description: 'Trạng thái của ứng viên',
    enum: CANDIDATE_RECRUITMENT_STATUS,
  })
  @IsNotEmpty()
  @IsNumber()
  status: number;

  @ApiProperty({
    required: false,
    description: 'Lý do không thành công',
    example: '',
  })
  note: string;

  @ApiProperty({
    required: false,
    description: 'Lịch hẹn phỏng vấn',
    example: '2023-10-02 10:00:00',
  })
  @IsDateString()
  @IsOptional()
  schedule: Date;

  @ApiProperty({
    required: false,
    description: 'Phỏng vấn online or Offline',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  is_online: number;
}
