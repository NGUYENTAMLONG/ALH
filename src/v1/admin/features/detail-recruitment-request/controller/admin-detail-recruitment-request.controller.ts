// Nest dependencies
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

// Local files
import { Roles } from '@decorators/roles.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { ROLE } from '@utils/constants';
import { AdminChangeStatusDetailRecruitmentRequestDto } from '../dto/change-status-detail-recruitment-request.dto';
import { AdminCreateDetailRecruitmentRequestDto } from '../dto/create-detail-recruitment-request.dto';
import { AdminFilterDetailRecruitmentRequestDto } from '../dto/filter-detail-recruitment-request.dto';
import { AdminDetailRecruitmentRequestService } from '../service/detail-recruitment-request.service';

@ApiTags('[ADMIN] detail recruitment request')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ADMIN, ROLE.IMPLEMENTATION_SALE, ROLE.RESPONSIBLE_SALE)
@Controller('admin/detail-recruitment-request')
export class AdminDetailRecruitmentRequestController {
  constructor(
    private readonly adminDetailRecruitmentRequirementService: AdminDetailRecruitmentRequestService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Chi tiết yêu cầu thuê nhân sự',
  })
  detail(@Query() dto: AdminFilterDetailRecruitmentRequestDto) {
    return this.adminDetailRecruitmentRequirementService.findAll(dto);
  }

  @Patch(':id/change-status')
  @ApiOperation({
    summary: 'Thay đổi trạng thái trong chi tiết yêu cầu thuê nhân sự',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết yêu cầu thuê  nhân sự',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thay đổi trạng thái thành công',
        data: {
          id: 4,
          candidate_information_id: 1,
          enterprise_id: '7',
          df_province_id: 101,
          professional_field_id: 1,
          hire_price: 10000000,
          status: 3,
          job_type_id: 1,
          updated_at: '2023-08-31T02:51:55.391Z',
          created_at: '2023-08-31T02:51:55.391Z',
        },
      },
    },
  })
  async changeStatus(
    @Param('id') id: number,
    @Body() dto: AdminChangeStatusDetailRecruitmentRequestDto,
  ) {
    const result =
      await this.adminDetailRecruitmentRequirementService.changeStatusDetailRecruitment(
        id,
        dto,
      );
    return result;
  }

  @Post()
  @ApiOperation({
    summary: 'Thêm mới yêu cầu thuê nhân sự',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết yêu cầu thuê  nhân sự',
  })
  async create(@Body() dto: AdminCreateDetailRecruitmentRequestDto) {
    const result = await this.adminDetailRecruitmentRequirementService.create(
      dto,
    );
    return result;
  }
}
