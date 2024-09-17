// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
// Other dependencies
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AdminUpdateStatusCandidateDto {
  @ApiProperty({
    required: true,
    description: 'Trạng thái của ứng viên',
    example: 1,
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống Trạng thái của ứng viên',
  })
  @IsNumber(
    {},
    {
      message: 'Vui lòng nhập id số',
    },
  )
  status: number;
}
