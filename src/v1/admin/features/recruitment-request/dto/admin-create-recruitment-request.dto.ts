// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
// Other dependencies
import { IsArray, IsNumber } from 'class-validator';

export class AdminCreateRecruitmentRequestDto {
  @ApiProperty({
    required: true,
    description: 'Tên doanh nghiệp',
    example: 7,
  })
  @IsNumber(
    {},
    {
      message: 'Vui lòng nhập id số',
    },
  )
  enterprise_id: number;

  @ApiProperty({
    required: true,
    description: 'ID của ứng viên',
    example: [1, 2],
  })
  @IsArray({ message: 'Vui lòng nhập một mảng' })
  @IsNumber({}, { each: true, message: 'Vui lòng nhập id là số' }) // Apply IsNumber decorator to each array element
  candidate_information_ids: number[];
}
