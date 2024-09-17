// Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import {
  CANDIDATE_RECRUITMENT_STATUS,
  RECRUITMENT_STATUS,
} from '@utils/constants';

// Other dependencies
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PagingDto } from 'src/shared/dto/paging.dto';

export class MiniAppFilterCandidateAppliedDto extends IntersectionType(
  PagingDto,
) {
  @ApiProperty({
    required: false,
    description: 'Lọc theo id job tuyển dụng',
    example: '1,2',
  })
  @IsOptional()
  recruitment_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo tên doanh nghiệp, số điện thoại, email',
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo trạng thái',
    enum: CANDIDATE_RECRUITMENT_STATUS,
  })
  @IsOptional()
  @IsString()
  status?: string;

  // @ApiProperty({
  //   required: false,
  //   description: 'Lọc theo tỉnh/thành phố',
  //   example: '101,102',
  // })
  // @IsOptional()
  // province_ids?: string;

  // @ApiProperty({
  //   required: false,
  //   description: 'Lọc theo nghành nghề',
  //   example: '101,102',
  // })
  // @IsOptional()
  // career_ids?: string;

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
}

export class HRFilterDetailPointDto extends IntersectionType(PagingDto) {
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
    description: 'Lọc theo trạng thái',
  })
  @IsOptional()
  status: number;
}

export class MiniAppSelectRecruitmentDto extends IntersectionType(PagingDto) {
  @ApiProperty({
    required: false,
    description: 'Lọc theo id job tuyển dụng',
    example: '1,2',
  })
  @IsOptional()
  recruitment_ids?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo tên doanh nghiệp, số điện thoại, email',
  })
  @IsOptional()
  search?: string;
}
