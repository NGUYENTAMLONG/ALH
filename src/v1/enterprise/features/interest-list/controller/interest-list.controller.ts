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
// Other files
import { AuthGuard } from '@guards/auth.guard';
// Local files
import { Roles } from '@decorators/roles.decorator';
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ROLE } from '@utils/constants';
import { EnterpriseAddCandidateInterestListDto } from '../dto/add-candidate-interest-list.dto';
import { EnterpriseInterestListService } from '../service/interest-list.service';
import { EnterpriseFilterInterestListDto } from './../dto/filter-interest-list.dto';

@ApiTags('[ENTERPRISE] interest list')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ENTERPRISE)
@Controller('enterprise/interest-list')
export class EnterpriseInterestListController {
  constructor(
    private readonly enterpriseInterestListService: EnterpriseInterestListService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách ứng viên',
    description: 'Trả về danh sách ứng viên đang có trong hệ thống',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách ứng viên',
  })
  async findAll(
    @Headers('token') token: any,
    @Query() dto: EnterpriseFilterInterestListDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const candidates = await this.enterpriseInterestListService.findAll(
      user_id,
      dto,
    );
    return candidates;
  }

  @Get('count-candidate')
  @ApiOperation({
    summary: 'Đếm số lượng Danh sách ứng viên',
    description: 'Trả về số lượng  ứng viên đang quan tâm',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về số lượng ứng viên',
  })
  async countCandidate(@Headers('token') token: any) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const candidates = await this.enterpriseInterestListService.countCandidate(
      user_id,
    );
    return candidates;
  }

  @Post()
  @ApiOperation({
    summary: 'Thêm ứng viên vào danh sách quan tâm',
    description: 'Thêm ứng viên vào danh sách quan tâm',
  })
  @ApiResponse({
    status: 200,
    description: 'Thêm ứng viên vào danh sách quan tâm',
  })
  async updateStatus(
    @Headers('token') token: any,
    @Body() dto: EnterpriseAddCandidateInterestListDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.enterpriseInterestListService.updateStatus(
      user_id,
      dto,
    );
    return result;
  }

  @Patch(':id/re-recruitment')
  @ApiOperation({
    summary: 'Tuyển lại ứng viên',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết ứng viên',
  })
  async changeStatus(@Headers('token') token: any, @Param('id') id: number) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.enterpriseInterestListService.changeStatus(
      user_id,
      id,
    );
    return result;
  }
}
