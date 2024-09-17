//Nest dependencies
import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
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
import { WebCandidateRecruitmentService } from '../service/recruitment.service';
import {
  CandidateInformationQueryDto,
  WebFilterRecruitmentByCandidateDto,
} from '../dto/filter-recruitment.dto';
import { FilterRecruitmentFavoriteDto } from '../dto/favorite-recruitment.dto';
import { RecruitmentIdDto } from '../dto/candidate-recruitment.dto';
import { Request } from 'express';
import { ApplyRecruitmentDto } from 'src/v1/mini-app/features/candidate/dto/candidate-apply.dto';
import { MiniAppCandidateService } from 'src/v1/mini-app/features/candidate/service/candidate-mini-app.service';
import { MiniAppRecruitmentService } from 'src/v1/mini-app/features/recruitment/service/recruitment.service';
import { MiniAppFilterRecruitmentByCandidateDto } from 'src/v1/mini-app/features/recruitment/dto/filter-recruitment.dto';

@ApiTags('[CANDIDATE] Recruitment')
@Controller('candidate/recruitment')
export class WebCandidateRecruitmentController {
  constructor(
    private readonly webCandidateRecruitmentService: WebCandidateRecruitmentService,
    private readonly miniAppCandidateService: MiniAppCandidateService,
    private readonly miniAppRecruitmentService: MiniAppRecruitmentService,
  ) {}

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.ADMIN, ROLE.CANDIDATE)
  @Get('list-for-candidate')
  @ApiOperation({
    summary: 'Danh sách job/yêu cầu tuyển dụng nhân sự (đối với ứng viên)',
  })
  async findAllForCandidate(
    @Headers('token') token: any,
    @Query() dto: WebFilterRecruitmentByCandidateDto,
    @Req() request: Request,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const url = request.url; // Lấy URL từ request
    const result = await this.miniAppRecruitmentService.findAllForCandidate(
      user_id,
      dto,
      url, // Truyền URL vào service nếu cần thiết
    );
    return result;
  }

  @Get('list-all') //Không có thông tin authen / chưa đăng nhập
  @ApiOperation({
    summary: 'Danh sách job/yêu cầu tuyển dụng nhân sự',
  })
  async findAll(@Query() dto: WebFilterRecruitmentByCandidateDto) {
    const result = await this.webCandidateRecruitmentService.findAll(dto);
    return result;
  }

  // @ApiSecurity('token')
  // @UseGuards(AuthGuard)
  // @Roles(
  //   ROLE.ADMIN,
  //   ROLE.IMPLEMENTATION_SALE,
  //   ROLE.RESPONSIBLE_SALE,
  //   ROLE.HRO,
  //   ROLE.CANDIDATE,
  // )
  @Get('/detail/:id')
  @ApiOperation({
    summary: 'Chi tiết yêu cầu tuyển dụng nhân sự',
  })
  async detail(
    @Param('id') id: number,
    @Query() dto: CandidateInformationQueryDto,
  ) {
    const result = await this.webCandidateRecruitmentService.detail(
      id,
      Number(dto.candidate_information_id),
    );
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.ADMIN, ROLE.CANDIDATE)
  @Get('list-applied')
  @ApiOperation({
    summary: 'Danh sách job/yêu cầu tuyển dụng nhân sự đã ứng tuyển (UV)',
  })
  async findAllApplied(
    @Headers('token') token: any,
    @Query() dto: WebFilterRecruitmentByCandidateDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.webCandidateRecruitmentService.findAllApplied(
      user_id,
      dto,
    );
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.HRO)
  @Get('get-favorite-recruitments')
  @ApiOperation({
    summary: 'Ứng viên lấy danh sách tuyển dụng yêu thích (web)',
  })
  async getMyFavoriteRecruitments(
    @Headers('token') token: any,
    @Query() dto: FilterRecruitmentFavoriteDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result =
      await this.webCandidateRecruitmentService.getMyRecruitmentFavorites(
        user_id,
        dto,
      );
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE)
  @Post('create-favorite-recruitment')
  @ApiOperation({
    summary: 'Ứng viên/cộng tác viên lưu tin tuyển dụng yêu thích (web)',
  })
  async saveFavoriteRecruitment(
    @Body() dto: RecruitmentIdDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result =
      await this.webCandidateRecruitmentService.saveFavoriteRecruitment(
        user_id,
        dto,
      );
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.HRO)
  @Post('apply-cv')
  @ApiOperation({
    summary: 'Ứng viên ứng tuyển cv',
  })
  async applyRecruitment(
    @Body() dto: ApplyRecruitmentDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.applyRecruitment(
      user_id,
      dto,
    );
    return result;
  }

  //Đếm các tin tuyển dụng với trạng thái tuyển dụng
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.ADMIN, ROLE.HRO, ROLE.CANDIDATE, ROLE.COLLABORATOR)
  @Get('counter-recruitment/group-by-status')
  @ApiOperation({
    summary:
      'Đếm số lượng các tin tuyển dụng nhóm theo trạng thái (đối với ứng viên/cộng tác viên) (web)',
  })
  async countCandidateRecruitmentWithStatus(
    @Headers('token') token: any,
    @Query() dto: MiniAppFilterRecruitmentByCandidateDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result =
      await this.miniAppRecruitmentService.countCandidateRecruitmentWithStatus(
        user_id,
        dto,
      );
    return result;
  }
}
