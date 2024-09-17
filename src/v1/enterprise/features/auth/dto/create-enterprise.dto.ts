import { ApiProperty } from '@nestjs/swagger';

export class CreateEnterpriseDto {
  @ApiProperty({
    description: 'Vị trí',
    example: null,
  })
  position: string;

  @ApiProperty({
    required: true,
    description: 'PK từ bảng user',
    example: 7,
  })
  user_id: number;

  @ApiProperty({
    required: true,
    description: 'Tên của công ty',
    example: 'Công ty cổ phần ABC',
  })
  name: string;
}
