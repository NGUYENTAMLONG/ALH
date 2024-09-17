// Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
//Other dependencies
import {
  IsBoolean,
  IsBooleanString,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';
//Local files
import { RECRUITMENT_STATUS } from '@utils/constants';
import { PagingDto } from 'src/shared/dto/paging.dto';

export class MiniAppFilterRecruitmentByHRODto extends IntersectionType(
  PagingDto,
) {
  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo tên doanh nghiệp, số điện thoại, email',
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    description:
      'Lọc theo trạng thái: 1 - Đã xử lý, 2 -  Đang chờ, 3 - Từ trối, 4 - Đang xử lý',
    enum: RECRUITMENT_STATUS,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo tỉnh/thành phố',
    example: '101,102',
  })
  @IsOptional()
  province_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo nghành nghề',
    example: '101,102',
  })
  @IsOptional()
  career_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày bắt đầu',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  from_date?: Date;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày kết thúc',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  to_date?: Date;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày bắt đầu (thời hạn nộp hồ sơ)',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  apply_deadline_from_date?: Date;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày kết thúc (thời hạn nộp hồ sơ)',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  apply_deadline_to_date?: Date;
}

export class MiniAppFilterRecruitmentByCandidateDto extends IntersectionType(
  PagingDto,
) {
  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo tên doanh nghiệp, số điện thoại, email',
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo tỉnh/thành phố',
    example: '101,102',
  })
  @IsOptional()
  province_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo nghành nghề',
    example: '101,102',
  })
  @IsOptional()
  career_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo kinh nghiệm',
    example: '101,102',
  })
  @IsOptional()
  years_of_experience_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo mức lương',
    example: '1,2',
  })
  @IsOptional()
  salary_range_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo Lĩnh vực',
    example: '11,12',
  })
  @IsOptional()
  professional_field_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo Chức vụ vị trí',
    example: '11,12',
  })
  @IsOptional()
  position_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày bắt đầu',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  from_date?: Date;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày kết thúc',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  to_date?: Date;

  @ApiProperty({
    required: false,
    description: 'Cho phép lưu thông tin tìm kiếm',
    example: 'true or false',
  })
  @IsOptional()
  @IsString()
  is_save: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo trạng thái tuyển dụng của ứng viên',
    example: '1,2,3,4,5,6',
  })
  @IsOptional()
  candidate_recruitment_ids?: string;
}

export class CandidateInformationQueryDto {
  @ApiProperty({
    required: false,
    description: 'Id thông tin ứng viên',
    example: '101',
  })
  @IsOptional()
  candidate_information_id: string;
}
