//Nest dependencies
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
// Local files
import { Roles } from '@decorators/roles.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { ROLE } from '@utils/constants';
import { AdminUpdateStatusRecruitmentDto } from '../dto/admin-change-status.dto';
import { AdminFilterRecruitmentDto } from '../dto/filter-recruitment.dto';
import { AdminRecruitmentService } from './../service/admin-recruitment.service';

@ApiTags('[ADMIN] recruitment')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ADMIN)
@Controller('admin/recruitment')
export class AdminRecruitmentController {
  constructor(
    private readonly adminRecruitmentService: AdminRecruitmentService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách yêu cầu tuyển dụng nhân sự',
  })
  findAll(@Query() dto: AdminFilterRecruitmentDto) {
    return this.adminRecruitmentService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Chi tiết yêu cầu tuyển dụng nhân sự',
  })
  detail(@Param('id') id: number) {
    return this.adminRecruitmentService.detail(id);
  }

  @Patch()
  @ApiOperation({
    summary: 'Thay đổi trạng thái yêu cầu tuyển dụng nhân sự',
  })
  async changeStatus(@Body() dto: AdminUpdateStatusRecruitmentDto) {
    const result = await this.adminRecruitmentService.changeStatus(dto);
    return result;
  }
}
