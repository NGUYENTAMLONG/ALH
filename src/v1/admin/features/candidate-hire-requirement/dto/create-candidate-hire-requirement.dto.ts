// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
// Other dependencies
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AdminCreateCandidateHireRequirementDto {
  @ApiProperty({
    required: true,
    description: 'Id của yêu cầu thuê',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  hire_requirement_id: number;

  @ApiProperty({
    required: true,
    description: 'Id của ứng viên',
    example: [1],
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true, message: 'Vui lòng nhập  số' }) // Apply IsNumber decorator to each array element
  candidate_information_ids: number[];
}
