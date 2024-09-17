// Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { RECRUITMENT_STATUS } from '@utils/constants';

// Other dependencies
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class InterestInforDto {
  @ApiProperty({
    required: true,
    description: 'Id thông tin ứng viên',
    example: '1',
  })
  @IsNotEmpty({ message: 'Id thông tin ứng viên là bắt buộc' })
  candidate_information_id: number;

  @ApiProperty({
    required: true,
    description: 'Nghề nghiệp mà user quan tâm',
    example: [101, 103],
  })
  @IsOptional()
  @IsArray({ message: 'Vui lòng nhập một mảng' })
  @IsNumber({}, { each: true, message: 'Vui lòng nhập id của nghề nghiệp' })
  career_ids: number[];

  @ApiProperty({
    required: true,
    description: 'Id chức vụ quan tâm',
    example: '1',
  })
  @IsOptional()
  position_id?: number;

  @ApiProperty({
    required: true,
    description: 'Id bằng cấp',
    example: '1',
  })
  @IsOptional()
  degree_id?: number;

  @ApiProperty({
    required: true,
    description: 'Id mức lương mong muốn',
    example: '1',
  })
  @IsOptional()
  salary_range_id?: number;

  @ApiProperty({
    required: true,
    description: 'Id số năm kinh nghiệm',
    example: '1',
  })
  @IsOptional()
  year_of_experience_id?: number;
}
