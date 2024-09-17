import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { BANNER_STATUS, BANNER_TYPE, ROLE } from '@utils/constants';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PagingDto } from 'src/shared/dto/paging.dto';

export class CreateBannerDto {
  @ApiProperty({
    required: true,
    description: 'Mã của banner (không bắt buộc)',
    example: 'MBN01',
  })
  @IsOptional({})
  code: string;

  @ApiProperty({
    required: true,
    description: 'Tiêu đề banner',
    example: 'Tiêu đề banner',
  })
  @IsOptional({})
  title: string;

  @ApiProperty({
    required: true,
    description: 'Tiêu đề banner',
    example: 'Tiêu đề banner',
  })
  @IsOptional({})
  description: string;

  @ApiProperty({
    required: true,
    description: 'url của banner',
    example: '',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống đường dẫn url banner/ảnh',
  })
  url: string;

  @ApiProperty({
    required: true,
    description: 'Loại của banner/tin tức',
    example: '1',
  })
  @IsOptional()
  type: number;

  @ApiProperty({
    required: true,
    description: 'Id navigate điều hướng',
    example: '1',
  })
  @IsOptional()
  navigate_id: number;

  @ApiProperty({
    required: true,
    description:
      'Id role tương ứng (banner dành cho đối tượng ứng viên hoặc hr,...)',
    example: '1',
  })
  @IsOptional()
  to_role: number;

  @ApiProperty({
    required: true,
    description: 'Đường link navigate của banner',
    example: 'Đường link navigate của banner',
  })
  @IsOptional({})
  navigate_link: string;
}

export class FilterBannerDto extends IntersectionType(PagingDto) {
  @ApiProperty({
    required: false,
    description: 'Lọc theo tiêu đề',
    example: 'Lọc theo tiêu đề',
  })
  @IsOptional({})
  search?: string;

  @ApiProperty({
    required: false,
    description:
      'Lọc theo loại: 1 - Banner (active), 2 - Chính sách (inactive)',
    enum: BANNER_TYPE,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo role id',
    enum: ROLE,
  })
  @IsOptional()
  @IsString()
  to_role?: string;

  @ApiProperty({
    required: false,
    description:
      'Lọc theo trạng thái: 1 - Đăng bài (active), 0 - Nháp (inactive)',
    enum: BANNER_STATUS,
  })
  @IsOptional()
  @IsString()
  status?: string;

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

export class UpdateBannerDto extends CreateBannerDto {
  @ApiProperty({
    required: true,
    description: 'Id banner',
    example: '1',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống banner id',
  })
  banner_id: number;

  @ApiProperty({
    required: true,
    description: 'Trạng thái banner (1-active, 0-inactive)',
    example: '1',
  })
  @IsOptional()
  status: number;

  @ApiProperty({
    required: true,
    description: 'Loại banner (Quảng cáo - 1, Tin tuyển dụng - 2, 3 - Khác)',
    example: '1',
  })
  @IsOptional()
  type: number;
}

export class UpdateBannerStatusDto {
  @ApiProperty({
    required: true,
    description: 'Id banner',
    example: '1',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống banner id',
  })
  banner_id: number;

  @ApiProperty({
    required: true,
    description: 'Trạng thái banner (1-active, 0-inactive)',
    example: '1',
  })
  @IsOptional()
  status: number;
}
