//Nest dependencies
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
//Local files
import { Roles } from '@decorators/roles.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ROLE } from '@utils/constants';
import { AdminUpdateStatusRecruitmentRequirementDto } from '../dto/admin-change-status.dto';
import { AdminDeleteRecruitmentDto } from '../dto/admin-delete-recruitment.dto';
import { AdminCreateRecruitmentDto } from '../dto/create-recruitment-requirement.dto';
import { AdminFilterRecruitmentRequirementDto } from '../dto/filter-recruitment-requirement.dto';
import { AdminRecruitmentRequirementService } from '../service/recruitment-requirement.service';

@ApiTags('[ADMIN] Recruitment Requirement')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Controller('admin/recruitment-requirement')
export class AdminRecruitmentRequirementController {
  constructor(
    private readonly adminRecruitmentRequirementService: AdminRecruitmentRequirementService,
  ) {}

  @Roles(ROLE.ADMIN, ROLE.RESPONSIBLE_SALE, ROLE.HRO, ROLE.CANDIDATE)
  @Post()
  @ApiOperation({ summary: 'Admin tạo yêu cầu tuyển dụng' })
  async create(
    @Body() dto: AdminCreateRecruitmentDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminRecruitmentRequirementService.create(
      user_id,
      dto,
    );
    return result;
  }

  @Roles(
    ROLE.ADMIN,
    ROLE.IMPLEMENTATION_SALE,
    ROLE.RESPONSIBLE_SALE,
    ROLE.HRO,
    ROLE.CANDIDATE,
  )
  @Patch(':id')
  @ApiOperation({ summary: 'Admin cập nhật yêu cầu tuyển dụng' })
  async update(
    @Body() dto: AdminCreateRecruitmentDto,
    @Param('id') id: number,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminRecruitmentRequirementService.update(
      id,
      user_id,
      dto,
    );
    return result;
  }

  @Roles(
    ROLE.ADMIN,
    ROLE.IMPLEMENTATION_SALE,
    ROLE.RESPONSIBLE_SALE,
    ROLE.HRO,
    ROLE.CANDIDATE,
  )
  @Get()
  @ApiOperation({
    summary: 'Danh sách yêu cầu tuyển dụng nhân sự',
  })
  async findAll(
    @Headers('token') token: any,
    @Query() dto: AdminFilterRecruitmentRequirementDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminRecruitmentRequirementService.findAll(
      user_id,
      dto,
    );
    return result;
  }

  @Roles(
    ROLE.ADMIN,
    ROLE.IMPLEMENTATION_SALE,
    ROLE.RESPONSIBLE_SALE,
    ROLE.HRO,
    ROLE.CANDIDATE,
  )
  @Get('pending-count')
  @ApiOperation({
    summary: 'Đếm số lượng yêu cầu tuyển dụng đang chờ',
  })
  async pendingCount() {
    const result =
      await this.adminRecruitmentRequirementService.recruitmentPendingCount();
    return result;
  }

  @Roles(
    ROLE.ADMIN,
    ROLE.IMPLEMENTATION_SALE,
    ROLE.RESPONSIBLE_SALE,
    ROLE.HRO,
    ROLE.CANDIDATE,
  )
  @Get(':id')
  @ApiOperation({
    summary: 'Chi tiết yêu cầu tuyển dụng nhân sự',
  })
  async detail(@Param('id') id: number) {
    const result = await this.adminRecruitmentRequirementService.detail(id);
    return result;
  }

  @Roles(
    ROLE.ADMIN,
    ROLE.IMPLEMENTATION_SALE,
    ROLE.RESPONSIBLE_SALE,
    ROLE.HRO,
    ROLE.CANDIDATE,
  )
  @Patch()
  @ApiOperation({
    summary: 'Thay đổi trạng thái yêu cầu tuyển dụng nhân sự',
  })
  async changeStatus(
    @Body() dto: AdminUpdateStatusRecruitmentRequirementDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminRecruitmentRequirementService.changeStatus(
      user_id,
      dto,
    );
    return result;
  }

  @Roles(ROLE.ADMIN, ROLE.IMPLEMENTATION_SALE, ROLE.RESPONSIBLE_SALE)
  @Delete()
  @ApiOperation({ summary: 'Admin xóa yêu cầu tuyển dụng' })
  async delete(
    @Body() dto: AdminDeleteRecruitmentDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminRecruitmentRequirementService.delete(
      user_id,
      dto,
    );
    return result;
  }
}
