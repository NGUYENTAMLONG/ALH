// Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { WALLET_MUTABLE_TYPE } from '@utils/constants';
import { IsDateString, IsOptional } from 'class-validator';
//Local files
import { PagingDto } from 'src/shared/dto/paging.dto';

export class EnterpriseFilterDetailWalletDto extends IntersectionType(
  PagingDto,
) {
  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày bắt đầu',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  from_date?: Date;

  @ApiProperty({
    required: false,
    description: 'Lọc theo ngày kết thúc',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Vui lòng nhập đúng định dạng thời gian DV: 2023-08-01',
    },
  )
  to_date?: Date;

  @ApiProperty({
    required: false,
    description: 'Lọc theo loại giao dịch',
    enum: WALLET_MUTABLE_TYPE,
  })
  @IsOptional()
  mutable_type?: number;
}
