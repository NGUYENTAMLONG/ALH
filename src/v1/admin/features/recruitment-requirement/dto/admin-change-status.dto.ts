// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
// Other dependencies
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AdminUpdateStatusRecruitmentRequirementDto {
  @ApiProperty({
    required: true,
    description: 'Trạng thái của yêu cầu tuyển dụng',
    example: 1,
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống Trạng thái của yêu cầu tuyển dụng',
  })
  @IsNumber(
    {},
    {
      message: 'Vui lòng nhập id số',
    },
  )
  status: number;

  @ApiProperty({
    required: true,
    description: 'Id của yêu cầu tuyển dụng',
    example: [1, 2],
  })
  @IsArray({ message: 'Vui lòng nhập một mảng' })
  @IsNumber({}, { each: true, message: 'Vui lòng nhập id là số' }) // Apply IsNumber decorator to each array element
  ids: number[];
}
