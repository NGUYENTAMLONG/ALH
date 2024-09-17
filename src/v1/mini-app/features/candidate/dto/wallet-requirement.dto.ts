// Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
//Other dependencies
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
//Local files
import { PagingDto } from 'src/shared/dto/paging.dto';

export class WalletRequirementDto {
  @ApiProperty({
    required: false,
    description: 'Chọn ngân hàng',
  })
  @IsOptional()
  bank_id: number;

  @ApiProperty({
    required: false,
    description: 'Số tài khoản ngân hàng',
  })
  @IsOptional()
  bank_account: string;

  @ApiProperty({
    required: false,
    description: 'Người thụ hưởng',
  })
  @IsOptional()
  to_user: string;

  @ApiProperty({
    required: false,
    description: 'Số tiền cần rút',
  })
  @IsOptional()
  money: number;
}
