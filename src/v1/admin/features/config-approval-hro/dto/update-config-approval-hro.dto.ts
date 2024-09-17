// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsNotEmpty } from 'class-validator';

export class UpdateConfigApprovalHroDto {
  @ApiProperty({
    required: true,
    description: 'Tự động duyệt tài khoản HRO',
    example: 1,
  })
  @IsNotEmpty()
  auto_approval: number;
}
