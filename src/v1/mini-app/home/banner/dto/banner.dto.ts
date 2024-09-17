import { ApiProperty } from '@nestjs/swagger';
import { ROLE } from '@utils/constants';
import { IsOptional, IsString } from 'class-validator';

export class FilterBannerDto {
  @ApiProperty({
    required: false,
    description: 'Lọc theo role id',
    enum: ROLE,
  })
  @IsOptional()
  @IsString()
  to_role?: string;
}
