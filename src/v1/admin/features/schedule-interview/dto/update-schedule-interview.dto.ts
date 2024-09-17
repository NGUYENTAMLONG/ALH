// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AdminUpdateScheduleInterviewDto {
  @ApiProperty({
    required: true,
    description: 'Tỉnh thành phố ',
  })
  @IsNotEmpty()
  df_province_id: number;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại',
    example: '0867487542',
  })
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    required: true,
    description: 'Người PV',
    example: 'interviewer',
  })
  @IsNotEmpty()
  interviewer: string;

  @ApiProperty({
    required: true,
    description: 'Hình thức PV',
    example: 1,
  })
  @IsOptional()
  is_online: number;

  @ApiProperty({
    required: true,
    description: 'Lịch hẹn phỏng vấn',
    example: '2023-10-31 15:00:00',
  })
  @IsNotEmpty()
  @IsDateString()
  schedule: Date;

  @ApiProperty({
    required: true,
    description: 'Địa chỉ chi tiết',
    example: '299 Trung Kính',
  })
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    required: false,
    description: 'Ghi chú',
    example: 'note',
  })
  @IsOptional()
  note: string;

  @ApiProperty({
    required: false,
    description: 'Chuyển trạng thái',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  is_change_status: number;

  @ApiProperty({
    required: false,
    description: 'email người phỏng vấn',
    example: 1,
  })
  @IsOptional()
  @IsString()
  email: string;
}
