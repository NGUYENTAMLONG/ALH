// Nest dependencies
import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common';
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
import { FilterEnterpriseCandidateHireRequirementDto } from '../dto/filter-candidate-hire-requirement.dto';
import { EnterpriseCandidateHireRequirementService } from '../service/candidate-hire-requirement.service';

@ApiTags('[ENTERPRISE] candidate hire')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ENTERPRISE)
@Controller('enterprise/candidate-hire-requirement')
export class EnterpriseCandidateHireRequirementController {
  constructor(
    private readonly enterpriseCandidateHireRequirementService: EnterpriseCandidateHireRequirementService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách ứng viên thêm mới trong yêu cầu thuê',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách  ứng viên trong yêu cầu thuê',
  })
  async findAll(
    @Query() dto: FilterEnterpriseCandidateHireRequirementDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.enterpriseCandidateHireRequirementService.findAll(
      user_id,
      dto,
    );
    return result;
  }
}
