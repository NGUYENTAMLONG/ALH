//Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { INTEREST_LIST_STATUS } from '@utils/constants';
//Other dependencies
import { IsOptional } from 'class-validator';
//Local dependencies
import { PagingDto } from 'src/shared/dto/paging.dto';

export class FilterDetailEnterpriseCandidateDto extends IntersectionType(
  PagingDto,
) {
  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo trạng thái ứng viên ',
    enum: INTEREST_LIST_STATUS,
  })
  @IsOptional()
  interest_status?: string;

  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo yêu cầu tuyển dụng',
    example: 566,
  })
  @IsOptional()
  recruitment_requirement_id?: number;
}
