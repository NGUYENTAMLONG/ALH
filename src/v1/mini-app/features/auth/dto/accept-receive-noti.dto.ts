// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
// Other dependencies
import { IsNotEmpty } from 'class-validator';

export class AcceptReceiveNotiDto {
  @ApiProperty({
    required: true,
    description: 'Xác nhận nhận thông báo từ hệ thống',
    example: 1,
  })
  @IsNotEmpty()
  is_receive_notification: number;
}
