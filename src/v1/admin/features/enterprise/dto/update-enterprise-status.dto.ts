// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEnterpriseStatusDto {
  @ApiProperty({
    required: true,
    description: 'Trạng thái hoạt động của doanh nghiệp',
  })
  status: 0 | 1;
}
