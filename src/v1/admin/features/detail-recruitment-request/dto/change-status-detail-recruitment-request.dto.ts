// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
//Other files
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class AdminChangeStatusDetailRecruitmentRequestDto {
  @ApiProperty({
    required: true,
    description: 'Trạng thái của ứng viên',
    example: 3,
  })
  @IsNumber()
  status: number;

  @ApiProperty({
    required: false,
    description: 'Ghi chú của ứng viên',
    example: 'okela',
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    required: false,
    description: 'Ngày bắt đầu làm việc của ứng viên',
    example: '2022-10-10',
  })
  @IsDateString()
  @IsOptional()
  start_time?: Date;

  @ApiProperty({
    required: false,
    description: 'Ngày kết thúc làm việc của ứng viên',
    example: '2023-10-10',
  })
  @IsDateString()
  @IsOptional()
  end_time?: Date;
}
