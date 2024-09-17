// Nest dependencies
import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
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
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ROLE } from '@utils/constants';
import { EnterpriseFilterCandidateRecruitmentDto } from '../dto/filter-candidate-recruitment.dto';
import { EnterpriseUpdateCandidateRecruitmentDto } from '../dto/update-candidate-recruitment.dto';
import { EnterpriseCandidateRecruitmentService } from '../service/candidate-recruitment.service';

@ApiTags('[ENTERPRISE] candidate recruitment')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ENTERPRISE)
@Controller('enterprise/candidate-recruitment')
export class EnterpriseCandidateRecruitmentController {
  constructor(
    private readonly enterpriseCandidateRecruitmentService: EnterpriseCandidateRecruitmentService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách ứng viên thêm mới trong yêu cầu tuyển dụng',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách  ứng viên trong yêu cầu tuyển dụng',
  })
  async findAll(
    @Query() dto: EnterpriseFilterCandidateRecruitmentDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result =
      await this.enterpriseCandidateRecruitmentService.getListCandidate(
        user_id,
        dto,
      );
    return result;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật ứng viên trong yêu cầu tuyển dụng',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết  ứng viên trong yêu cầu tuyển dụng',
  })
  async update(
    @Param('id') id: number,
    @Body() dto: EnterpriseUpdateCandidateRecruitmentDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.enterpriseCandidateRecruitmentService.update(
      id,
      dto,
      user_id,
    );
    return result;
  }
}
