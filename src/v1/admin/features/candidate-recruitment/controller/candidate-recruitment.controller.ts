// Nest dependencies
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
import { AdminCreateCandidateRecruitmentDto } from '../dto/create-candidate-recruitment.dto';
import { FilterAdminCandidateRecruitment } from '../dto/filter-candidate-recruitment.dto';
import { AdminUpdateCandidateRecruitmentDto } from '../dto/update-candidate-recruitment.dto';
import { AdminCandidateRecruitmentService } from '../service/candidate-recruitment.service';

@ApiTags('[ADMIN] candidate recruitment')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(
  ROLE.ADMIN,
  ROLE.HRO,
  ROLE.IMPLEMENTATION_SALE,
  ROLE.RESPONSIBLE_SALE,
  ROLE.CANDIDATE,
)
@Controller('admin/candidate-recruitment')
export class AdminCandidateRecruitmentController {
  constructor(
    private readonly adminCandidateRecruitmentService: AdminCandidateRecruitmentService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Thêm mới ứng viên vào yêu cầu tuyển dụng',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết thêm ứng viên',
  })
  async create(
    @Body() dto: AdminCreateCandidateRecruitmentDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminCandidateRecruitmentService.create(
      user_id,
      dto,
    );
    return result;
  }

  @Get()
  @ApiOperation({
    summary: 'Danh sách ứng viên thêm mới trong yêu cầu tuyển dụng',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách ứng viên trong yêu cầu tuyển dụng',
  })
  async findAll(
    @Query() dto: FilterAdminCandidateRecruitment,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminCandidateRecruitmentService.findAll(
      user_id,
      dto,
    );
    return result;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Chi tiết ứng viên thêm mới trong yêu cầu tuyển dụng',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết  ứng viên trong yêu cầu tuyển dụng',
  })
  async detail(@Param('id') id: number) {
    const result = await this.adminCandidateRecruitmentService.detail(id);
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
    @Body() dto: AdminUpdateCandidateRecruitmentDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminCandidateRecruitmentService.update(
      id,
      dto,
      user_id,
    );
    return result;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa ứng viên trong yêu cầu tuyển dụng',
  })
  async delete(@Param('id') id: number, @Headers('token') token: any) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminCandidateRecruitmentService.delete(
      id,
      user_id,
    );
    return result;
  }
}
