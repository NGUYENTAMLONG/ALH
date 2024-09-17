import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProfessionalFieldDto {
  @ApiProperty({
    required: true,
    description: 'Tên lĩnh vực chuyên môn',
    example: 'CEO',
  })
  @IsNotEmpty({
    message: 'Vui lòng không bỏ trống tên lĩnh vực chuyên môn',
  })
  name: string;

  @ApiProperty({
    required: false,
    description: 'Mô tả về lĩnh vực chuyên môn',
    example: 'Lĩnh vực đang cần nhân lực vào thời điểm hiện tại',
  })
  @IsOptional()
  description: string;
}
