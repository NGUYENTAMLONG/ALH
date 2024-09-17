//Nest dependencies
import {
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
//Local dependencies
import { AuthGuard } from '@guards/auth.guard';
//Local dependencies
import { Roles } from '@decorators/roles.decorator';
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ROLE } from '@utils/constants';
import { FilterDetailEnterpriseCandidateDto } from '../dto/filter-detail-enterprise-candidate.dto';
import { FilterEnterpriseCandidateDto } from '../dto/filter-enterprise-candidate.dto';
import { EnterpriseCandidateService } from '../service/enterprise-candidate.service';

@ApiTags('ENTERPRISE candidate')
@Controller('enterprise/candidate')
export class EnterpriseCandidateController {
  constructor(
    private readonly enterpriseCandidateService: EnterpriseCandidateService,
  ) {}

  @ApiSecurity('token')
  @Get()
  @ApiOperation({
    summary: 'Danh sách ứng viên',
    description: 'Trả về danh sách ứng viên đang có trong hệ thống',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách ứng viên',
  })
  async getListCandidate(
    @Query() dto: FilterEnterpriseCandidateDto,
    @Headers('token') token: any,
  ) {
    let user_id;
    if (token) {
      user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    }
    const candidates = await this.enterpriseCandidateService.getListCandidate(
      user_id,
      dto,
    );
    return candidates;
  }

  @UseGuards(AuthGuard)
  @Roles(ROLE.ENTERPRISE)
  @ApiSecurity('token')
  @Get(':id')
  @ApiOperation({
    summary: 'Chi tiết ứng viên',
    description: 'Trả về chi tiết ứng viên',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết ứng viên',
  })
  async getDetailCandidate(
    @Param('id') id: number,
    @Query() dto: FilterDetailEnterpriseCandidateDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const candidate = await this.enterpriseCandidateService.detailCandidate(
      user_id,
      id,
      dto,
    );
    return candidate;
  }

  @UseGuards(AuthGuard)
  @Roles(ROLE.ENTERPRISE)
  @ApiSecurity('token')
  @Patch(':id/choose-candidate')
  @ApiOperation({
    summary: 'Chọn ứng viên',
  })
  @ApiResponse({
    status: 200,
    description: 'Chọn ứng viên thành công',
  })
  async chooseCandidate(@Param('id') id: number, @Headers('token') token: any) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    return this.enterpriseCandidateService.chooseCandidate(user_id, id);
  }
}
