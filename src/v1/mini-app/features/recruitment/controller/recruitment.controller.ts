//Nest dependencies
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Patch,
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
import { MiniAppRecruitmentService } from '../service/recruitment.service';
import { HROCreateRecruitmentWithEnterperiseDto } from '../dto/create-recruitment.dto';
import {
  CandidateInformationQueryDto,
  MiniAppFilterRecruitmentByCandidateDto,
  MiniAppFilterRecruitmentByHRODto,
} from '../dto/filter-recruitment.dto';
import {
  HROUpdateRecruitmentWithEnterperiseDto,
  RecruitmentRequirementDto,
} from '../dto/update-recruitment.dto';
import { Request } from 'express';

@ApiTags('[MINI-APP] Recruitment')
@Controller('mini-app/recruitment')
export class MiniAppRecruitmentController {
  constructor(
    private readonly miniAppRecruitmentService: MiniAppRecruitmentService,
  ) {}

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.ADMIN, ROLE.HRO)
  @Post()
  @ApiOperation({
    summary: 'HRO tạo yêu cầu tuyển dụng (bao gồm thông tin doanh nghiệp)',
  })
  async create(
    @Body() dto: HROCreateRecruitmentWithEnterperiseDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppRecruitmentService.create(user_id, dto);
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.ADMIN, ROLE.IMPLEMENTATION_SALE, ROLE.RESPONSIBLE_SALE, ROLE.HRO)
  @Get('list-for-hr')
  @ApiOperation({
    summary: 'Danh sách job/yêu cầu tuyển dụng nhân sự (đối với HR)',
  })
  async findAllForHRO(
    @Headers('token') token: any,
    @Query() dto: MiniAppFilterRecruitmentByHRODto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppRecruitmentService.findAllForHRO(
      user_id,
      dto,
    );
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.ADMIN, ROLE.CANDIDATE, ROLE.COLLABORATOR)
  @Get('list-for-candidate')
  @ApiOperation({
    summary:
      'Danh sách job/yêu cầu tuyển dụng nhân sự (đối với ứng viên/cộng tác viên)',
  })
  async findAllForCandidate(
    @Headers('token') token: any,
    @Query() dto: MiniAppFilterRecruitmentByCandidateDto,
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
  async findAll(@Query() dto: MiniAppFilterRecruitmentByCandidateDto) {
    const result = await this.miniAppRecruitmentService.findAll(dto);
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
    const result = await this.miniAppRecruitmentService.detail(
      id,
      Number(dto.candidate_information_id),
    );
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.ADMIN, ROLE.HRO)
  @Post('update')
  @ApiOperation({
    summary: 'HRO cập nhật yêu cầu tuyển dụng (bao gồm thông tin doanh nghiệp)',
  })
  async update(
    @Body() dto: HROUpdateRecruitmentWithEnterperiseDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppRecruitmentService.update(user_id, dto);
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.ADMIN, ROLE.HRO)
  @Post('change-to-processed')
  @ApiOperation({
    summary: 'HRO chuyển trạng thái (Lưu Nháp -> Đăng Tuyển)',
  })
  async changeToProcessed(
    @Body() dto: RecruitmentRequirementDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppRecruitmentService.changeToProcessed(
      user_id,
      dto,
    );
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.ADMIN, ROLE.CANDIDATE, ROLE.COLLABORATOR)
  @Get('list-applied')
  @ApiOperation({
    summary: 'Danh sách job/yêu cầu tuyển dụng nhân sự đã ứng tuyển (UV)',
  })
  async findAllApplied(
    @Headers('token') token: any,
    @Query() dto: MiniAppFilterRecruitmentByCandidateDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppRecruitmentService.findAllApplied(
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
      'Đếm số lượng các tin tuyển dụng nhóm theo trạng thái (đối với ứng viên/cộng tác viên)',
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
