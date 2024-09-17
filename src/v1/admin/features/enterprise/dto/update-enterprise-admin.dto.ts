// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateEnterPriseAdminDto {
  @ApiProperty({
    required: false,
    example: 'File',
    type: 'string',
    format: 'binary',
  })
  logo?: string | null;

  @ApiProperty({
    required: true,
    description: 'Tên của công ty',
    example: 'Công ty cổ phần ABC',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống tên của công ty',
  })
  enterprise_name: string;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại chính dùng để liên hệ với doanh nghiệp',
    example: '0987654321',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống số điện thoại chính của doanh nghiệp',
  })
  @IsString({
    message: 'Vui lòng nhập số điện thoại chính của doanh nghiệp là một chuỗi',
  })
  phone_number: string;

  @ApiProperty({
    required: false,
    description:
      'Số điện thoại phụ dùng để liên lạc với doanh nghiệp (không bắt buộc nhập)',
    example: null,
  })
  @IsOptional()
  alternate_phone?: string;

  @ApiProperty({
    required: true,
    description: 'Tên người đại diện công ty',
    example: 'Nguyễn Văn A',
  })
  manager: string;

  @ApiProperty({
    required: false,
    description: 'Chức vụ của người đại diện',
    example: 'CEOOOO',
  })
  @IsOptional()
  position: string;

  @ApiProperty({
    required: true,
    description: 'Email dùng để liên hệ với công ty',
    example: 'nguyenvana@gmail.com',
  })
  @IsEmail(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng email',
    },
  )
  email: string;

  @ApiProperty({
    required: false,
    description: 'Lĩnh vực hoạt động của công ty',
    example: '1',
  })
  @IsOptional()
  @IsString()
  professional_field_text: string;

  @ApiProperty({
    required: false,
    description: 'Link facebook của doanh nghiệp',
    example: 'abcxyz',
  })
  @IsOptional()
  facebook?: string;

  @ApiProperty({
    required: false,
    description: 'Link linkedin của doanh nghiệp',
    example: 'abcxyz',
  })
  @IsOptional()
  linkedin?: string;

  @ApiProperty({
    required: false,
    description: 'Link website của doanh nghiệp',
    example: 'abcxyz',
  })
  @IsOptional()
  website?: string;

  @ApiProperty({
    required: false,
    description: 'Mã thuế của doanh nghiệp',
    example: 'abcxyz',
  })
  @IsOptional()
  tax_code?: string;

  @ApiProperty({
    required: true,
    description: 'Id thành phố',
    example: '1',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trông mã tỉnh/thành phố',
  })
  province: number;

  @ApiProperty({
    required: false,
    description: 'Id quận/huyện',
    example: 'abcxyz',
  })
  @IsOptional()
  district?: number;

  @ApiProperty({
    required: false,
    description: 'Id phường/xã',
    example: 'abcxyz',
  })
  @IsOptional()
  ward?: number;

  @ApiProperty({
    required: false,
    description: 'Địa chỉ chi tiết',
    example: 'Ngõ 178',
  })
  @IsOptional()
  address?: string;

  @ApiProperty({
    required: true,
    description: 'Sale phụ trách',
    example: 'Nguyễn Thị A',
  })
  @IsOptional()
  salesperson?: string;

  @ApiProperty({
    required: false,
    description: 'Mô tả công ty',
    example: 'Công ty cổ phần ABCXYZ',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: true,
    description: 'Sale phụ trách',
    example: 102,
  })
  @IsOptional()
  responsible_sale_id: number;
}
