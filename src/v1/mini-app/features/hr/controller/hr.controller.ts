//Nest dependencies
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
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
//Local files
import { Roles } from '@decorators/roles.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ROLE } from '@utils/constants';
import { MiniAppHRService } from '../service/hr.service';
import {
  HRFilterDetailPointDto,
  MiniAppFilterCandidateAppliedDto,
  MiniAppSelectRecruitmentDto,
} from '../dto/hr.dto';

@ApiTags('[MINI-APP] HR')
@Controller('mini-app/hr')
export class MiniAppHRController {
  constructor(private readonly miniAppHRService: MiniAppHRService) {}

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.HRO)
  @Get('select/all-recruitment')
  @ApiOperation({
    summary: 'HR lấy danh sách select các vị trí ứng tuyển đã đăng tuyển dụng',
  })
  async getAllSelectRecruitment(
    @Headers('token') token: any,
    @Query() dto: MiniAppSelectRecruitmentDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppHRService.getAllSelectRecruitment(
      user_id,
      dto,
    );
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.HRO)
  @Get('list-candidate-applied')
  @ApiOperation({
    summary:
      'HR lấy danh sách các ứng viên đã ứng tuyển vào các tin tuyển dụng đã đăng',
  })
  async getCandidateApplied(
    @Headers('token') token: any,
    @Query() dto: MiniAppFilterCandidateAppliedDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppHRService.getCandidateApplied(
      user_id,
      dto,
    );
    return result;
  }

  @ApiOperation({
    summary: 'Lịch sử thay đổi điểm',
  })
  @ApiResponse({
    description: 'Lịch sử thay đổi điểm',
  })
  @Roles(ROLE.ADMIN, ROLE.HRO)
  @Get('/point-history/:id')
  async detail(@Param('id') id: number, @Query() dto: HRFilterDetailPointDto) {
    const result = await this.miniAppHRService.detail(id, dto);
    return result;
  }
}
