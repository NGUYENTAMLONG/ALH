// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AdminCreateEnterpriseDataFieldDto {
  @ApiProperty({
    required: true,
    description: 'Tên của thuộc tính',
    example: 'thuộc tính a',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống tên thuộc tính',
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'Mã của thuộc tính',
    example: 'thuoc_tinh_a',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống mã thuộc tính',
  })
  code: string;

  @ApiProperty({
    required: true,
    description: 'Kiểu dữ liệu: [text, number, date_time, options] ',
    example: 'text',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống kiểu dữ liệu',
  })
  data_type: string;

  @ApiProperty({
    required: true,
    description: 'STT hiển thị',
    example: 2,
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống STT hiển thị',
  })
  order: number;

  @ApiProperty({
    required: false,
    description: 'Lụa chọn select',
    example: ['11111', '2222', 'lua chon'],
  })
  @IsArray({ message: 'Vui lòng nhập một mảng các lựa chọn' })
  @IsOptional()
  @IsString({
    each: true,
    message: 'Vui lòng nhập mảng các lựa chọn đúng định dạng chuỗi ký tự',
  })
  options: string[];
}
