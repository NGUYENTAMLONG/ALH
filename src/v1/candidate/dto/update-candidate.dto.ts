import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateEnterpriseDto {
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
  name: string;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại chính dùng để liên hệ với doanh nghiệp',
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
  })
  manager: string;

  @ApiProperty({
    required: false,
    description: 'Chức vụ của người đại diện',
  })
  @IsOptional()
  position?: string;

  @ApiProperty({
    required: true,
    description: 'Email dùng để liên hệ với công ty',
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
  })
  @IsOptional()
  professional_field_id: number;

  @ApiProperty({
    required: false,
    description: 'Link facebook của doanh nghiệp',
  })
  @IsOptional()
  facebook?: string;

  @ApiProperty({
    required: false,
    description: 'Link linkedin của doanh nghiệp',
  })
  @IsOptional()
  linkedin?: string;

  @ApiProperty({
    required: false,
    description: 'Link website của doanh nghiệp',
  })
  @IsOptional()
  website?: string;

  @ApiProperty({
    required: true,
    description: 'Địa chỉ province',
  })
  @IsNotEmpty()
  province: number;

  @ApiProperty({
    required: false,
    description: 'Địa chỉ district',
  })
  @IsOptional()
  district?: number;

  @ApiProperty({
    required: false,
    description: 'Địa chỉ ward',
  })
  @IsOptional()
  ward?: number;

  @ApiProperty({
    required: false,
    description: 'Địa chỉ chi tiết',
  })
  @IsOptional()
  address?: string;

  @ApiProperty({
    required: false,
    description: 'Mô tả công ty',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: true,
    description: 'Mô tả lĩnh vực hoạt động',
  })
  @IsNotEmpty()
  professional_field_text?: string;

  @ApiProperty({
    required: true,
    description: 'Số lượng nhân viên',
  })
  @IsNotEmpty()
  employee_count?: number;

  @ApiProperty({
    required: false,
    description: 'Sale phụ trách',
  })
  @IsOptional()
  @IsString()
  salesperson: string;
}
