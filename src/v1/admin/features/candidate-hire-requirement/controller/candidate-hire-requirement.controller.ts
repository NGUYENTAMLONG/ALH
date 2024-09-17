// Nest dependencies
import {
  Body,
  Controller,
  Get,
  Headers,
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
// Local dependencies
import { Roles } from '@decorators/roles.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ROLE } from '@utils/constants';
import { AdminCreateCandidateHireRequirementDto } from '../dto/create-candidate-hire-requirement.dto';
import { FilterAdminCandidateHireRequirement } from '../dto/filter-candidate-hire-requirement.dto';
import { AdminUpdateCandidateHireRequirementDto } from '../dto/update-candidate-hire-requirement.dto';
import { AdminCandidateHireRequirementService } from '../service/candidate-hire-requirement.service';

@ApiTags('[ADMIN] candidate hire')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ADMIN)
@Controller('admin/candidate-hire-requirement')
export class AdminCandidateHireRequirementController {
  constructor(
    private readonly adminCandidateHireRequirementService: AdminCandidateHireRequirementService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Thêm mới ứng viên vào yêu cầu thuê',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết thêm ứng viên',
  })
  async create(
    @Body() dto: AdminCreateCandidateHireRequirementDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminCandidateHireRequirementService.create(
      user_id,
      dto,
    );
    return result;
  }

  @Get()
  @ApiOperation({
    summary: 'Danh sách ứng viên thêm mới trong yêu cầu thuê',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách  ứng viên trong yêu cầu thuê',
  })
  async findAll(
    @Query() dto: FilterAdminCandidateHireRequirement,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminCandidateHireRequirementService.findAll(
      user_id,
      dto,
    );
    return result;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật trạng thái ứng viên thêm mới trong yêu cầu thuê',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết  ứng viên trong yêu cầu thuê',
  })
  async updateStatus(
    @Param('id') id: number,
    @Headers('token') token: any,
    @Body() dto: AdminUpdateCandidateHireRequirementDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminCandidateHireRequirementService.updateStatus(
      id,
      dto,
    );
    return result;
  }
}
