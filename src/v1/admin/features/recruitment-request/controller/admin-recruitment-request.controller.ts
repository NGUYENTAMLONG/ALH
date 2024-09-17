// Nest dependencies
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

// Local files
import { Roles } from '@decorators/roles.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { ROLE } from '@utils/constants';
import { AdminCreateRecruitmentRequestDto } from '../dto/admin-create-recruitment-request.dto';
import { AdminFilterRecruitmentRequestDto } from '../dto/filter-recruitment-request.dto';
import { AdminRecruitmentRequestService } from '../service/admin-recruitment-request.service';

@ApiTags('[ADMIN] recruitment request')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ADMIN, ROLE.IMPLEMENTATION_SALE, ROLE.RESPONSIBLE_SALE)
@Controller('admin/recruitment-request')
export class AdminRecruitmentRequestController {
  constructor(
    private readonly adminRecruitmentRequestService: AdminRecruitmentRequestService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách yêu cầu thuê nhân sự',
  })
  findAll(@Query() dto: AdminFilterRecruitmentRequestDto) {
    return this.adminRecruitmentRequestService.findAll(dto);
  }

  @Post()
  @ApiOperation({
    summary: 'Thêm mới yêu cầu thuê nhân sự',
  })
  async create(@Body() dto: AdminCreateRecruitmentRequestDto) {
    const result = await this.adminRecruitmentRequestService.create(dto);
    return result;
  }
}
