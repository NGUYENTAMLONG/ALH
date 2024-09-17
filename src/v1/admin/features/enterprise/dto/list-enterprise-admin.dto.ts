// Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { RECRUITMENT_STATUS } from '@utils/constants';

// Other dependencies
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

// Local files
import { PagingDto } from 'src/shared/dto/paging.dto';

export class ListEnterpriseAdminDto extends IntersectionType(PagingDto) {
  @ApiProperty({
    required: false,
    description: 'Lọc theo tên doanh nghiệp theo tên, số điện thoại, email',
    example: 'Công ty cổ phần ABC',
  })
  @IsOptional()
  @IsString({
    message: 'Vui lòng nhập tham số search là một chuỗi',
  })
  search?: string;

  @ApiProperty({
    required: false,
    description: "Lọc theo địa điểm làm việc(thành phố) VD: ['1', '2', '3']",
    example: ['1', '2', '3'],
  })
  @IsOptional()
  province?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo trạng thái của doanh nghiệp',
    example: 1,
  })
  status?: number;

  @ApiProperty({
    required: false,
    description: "Lọc theo tên của Sale, VD: ['Nguyễn Thị A', 'Lê Thị B']",
    example: ['Nguyễn Thị A', 'Lê Thị B'],
  })
  @IsOptional()
  salesperson?: string;

  @ApiProperty({
    required: false,
    description: "Lọc theo lĩnh vực chuyên môn VD: ['1', '2', '3']",
    example: ['1', '2', '3'],
  })
  @IsOptional()
  professional_field?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày bắt đầu',
    example: '2023-08-01',
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
    example: '2023-08-31',
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

export class AdminFilterRecruitmentOfEnterpriseDto extends IntersectionType(
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
}
