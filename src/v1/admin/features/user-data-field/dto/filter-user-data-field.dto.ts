// Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
// Other dependencies
import { IsOptional } from 'class-validator';
// Local files
import { IS_ACTIVE } from '@utils/constants';
import { PagingDto } from 'src/shared/dto/paging.dto';

export class AdminFilterUserDataFieldDto extends IntersectionType(PagingDto) {
  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo tên thuộc tính',
    example: 'thuộc tính a',
  })
  @IsOptional()
  search: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo trạng thái [1: Hoạt động, 0: Không hoạt động]',
    enum: IS_ACTIVE,
  })
  @IsOptional()
  status: number;
}
