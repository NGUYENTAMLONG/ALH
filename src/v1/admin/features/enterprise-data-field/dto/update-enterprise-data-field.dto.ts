// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
class UpdateOption {
  @ApiProperty({
    required: true,
    description: 'id của thuộc tính',
    example: 1,
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống id của thuộc tính select',
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'Tên của thuộc tính',
    example: '111111',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống tên thuộc tính',
  })
  name: string;
}
export class AdminUpdateEnterpriseDataFieldDto {
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
    example: [
      { id: 1, name: '11111' },
      { id: 2, name: '2222' },
      { id: 3, name: 'lua chon' },
    ],
  })
  @IsArray({ message: 'Vui lòng nhập một mảng các lựa chọn select' })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateOption)
  options: UpdateOption[];

  @ApiProperty({
    required: true,
    description: 'Trạng thái của thuộc tính',
    example: 0,
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống trạng thái của thuộc tính',
  })
  status: number;
}
