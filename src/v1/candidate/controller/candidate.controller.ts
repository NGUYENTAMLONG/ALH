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
import { UpdateEnterpriseDto } from '@enterprise/dto/update-enterprise.dto';
import { AuthGuard } from '@guards/auth.guard';
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ROLE } from '@utils/constants';
import { CandidateService } from '../service/candidate.service';
import { switchAutoSaveSearchingData } from '@utils/save-searching';
import { sendSuccess } from '@utils/send-success';
import {
  FilterApplicationDto,
  FilterAppliedRecruitmentDto,
} from '../features/recruitment/dto/candidate-recruitment.dto';
import { MiniAppCandidateService } from 'src/v1/mini-app/features/candidate/service/candidate-mini-app.service';
import {
  ApplicationIdDto,
  ChangeCVNameDto,
  CreateApplicationDto,
  FileCVUpload,
  UpdateApplicationDto,
} from 'src/v1/mini-app/features/candidate/dto/application.dto';
import { AuthMiniAppService } from 'src/v1/mini-app/features/auth/service/auth-mini-app.service';
import { CandidateInterestService } from 'src/v1/mini-app/features/candidate-interest/service/candidate-interest.service';

@ApiTags('[CANDIDATE] information')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.CANDIDATE)
@Controller('candidate')
export class CandidateController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly miniAppCandidateService: MiniAppCandidateService,
    private readonly authService: AuthMiniAppService,
    private readonly candidateInterestService: CandidateInterestService,
  ) {}

  // @Get()
  // @ApiOperation({
  //   summary: 'Thông tin chi tiết ứng viên',
  // })
  // async findOne(@Headers('token') token: any) {
  //   const id = jwtManipulationService.decodeJwtToken(token, 'id');

  //   return await this.candidateService.findOne(id);
  // }

  @Get('me')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Lấy thông tin tài khoản ứng viên',
    description: 'Lấy thông tin tài khoản ứng viên',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin tài khoản',
  })
  async getInfo(@Headers('token') token: any): Promise<any> {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const authResponse = await this.candidateService.getInfo(user_id);

    return authResponse;
  }

  // @Patch()
  // @ApiOperation({
  //   summary: 'Cập nhật thông tin của ứng viên',
  // })
  // async update(@Headers('token') token: any, @Body() dto: UpdateEnterpriseDto) {
  //   const id = jwtManipulationService.decodeJwtToken(token, 'id');

  //   return await this.candidateService.update(id, dto);
  // }

  @Post('switch-save-searching')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Bật/Tắt lưu thông tin tìm kiếm công việc',
  })
  @ApiResponse({
    status: 200,
    description: 'Bật/Tắt lưu thông tin tìm kiếm công việc thành công',
  })
  async switchSaveSearching(@Headers('token') token: any): Promise<any> {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    await switchAutoSaveSearchingData(user_id);

    return sendSuccess({ msg: 'Thành công' });
  }

  @Get('my-searching-data')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Lấy thông tin tìm kiếm job đã lưu (nếu có)',
    description: 'Lấy thông tin tìm kiếm job đã lưu (nếu có)',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin tìm kiếm job đã lưu (nếu có)',
  })
  async getSearchingData(@Headers('token') token: any): Promise<any> {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const authResponse = await this.authService.getSearchingData(user_id);

    return authResponse;
  }

  //Danh sách hồ sơ của ứng viên
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.ADMIN, ROLE.CANDIDATE, ROLE.HRO)
  @Get('my-application-list')
  @ApiOperation({
    summary: 'Ứng viên lấy danh sách hồ sơ (web ứng viên)',
  })
  async getApplications(
    @Headers('token') token: any,
    @Query() dto: FilterApplicationDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.getApplicationList(
      user_id,
      dto,
    );
    return result;
  }

  //Danh sách cv đã tải lên từ máy
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.ADMIN, ROLE.CANDIDATE, ROLE.HRO)
  @Get('my-cv-uploadeds')
  @ApiOperation({
    summary: 'Ứng viên lấy danh sách cv đã tải lên từ máy (web ứng viên)',
  })
  async getCvUploaded(
    @Headers('token') token: any,
    @Query() dto: FilterApplicationDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.getCVUploadeds(
      user_id,
      dto,
    );
    return result;
  }

  //Xử lí hồ sơ (tương ứng với trên mini-app)
  //Chọn hồ sơ chính
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.HRO)
  @Post('choose-main-application')
  @ApiOperation({
    summary: 'Ứng viên chọn hồ sơ chính (web ứng viên)',
  })
  async ChooseMainApplication(
    @Body() dto: ApplicationIdDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.chooseMainApplication(
      user_id,
      dto,
    );
    return result;
  }

  //Detail
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.HRO)
  @Get('detail-application/:id')
  @ApiOperation({
    summary:
      'Ứng viên lấy thông tin chi tiết hồ sơ (từ danh sách hồ sơ) (web ứng viên)',
  })
  async detailApplicationFromList(@Param('id') id: number) {
    const result =
      await this.miniAppCandidateService.getDetailApplicationFromList(id);
    return result;
  }

  //Tạo
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.HRO)
  @Post('create-application')
  @ApiOperation({
    summary: 'Ứng viên tạo mới hồ sơ (web ứng viên)',
  })
  async createApplication(
    @Body() dto: CreateApplicationDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.createApplication(
      user_id,
      dto,
    );
    return result;
  }

  //Cập nhật
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.HRO)
  @Post('update-application')
  @ApiOperation({
    summary: 'Ứng viên cập nhật hồ sơ (web ứng viên)',
  })
  async updateApplication(
    @Body() dto: UpdateApplicationDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.updateApplication(
      user_id,
      dto,
    );
    return result;
  }

  //Xoá hồ sơ
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.HRO)
  @Delete('delete-application/:id')
  @ApiOperation({
    summary: 'Ứng viên xoá hồ sơ (web ứng viên)',
  })
  async deleteApplication(
    @Param('id') id: number,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.deleteApplication(
      user_id,
      id,
    );
    return result;
  }

  //Ứng viên đổi tên file (file đã upload)
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.HRO)
  @Post('change-cv-name')
  @ApiOperation({
    summary: 'Ứng viên cập nhật tên cv (web ứng viên)',
  })
  async changeCVName(
    @Body() dto: ChangeCVNameDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.changeCVName(
      user_id,
      dto,
    );
    return result;
  }

  //Đã ứng tuyển
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR)
  @Get('get-applied-recruitments')
  @ApiOperation({
    summary:
      'Ứng viên/Cộng tác viên lấy danh sách tuyển dụng đã ứng tuyển (web)',
  })
  async getAppliedRecruitments(
    @Headers('token') token: any,
    @Query() dto: FilterAppliedRecruitmentDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.getAppliedRecruitment(
      user_id,
      dto,
    );
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR)
  @Get('/detail-applied-recruitment/:id')
  @ApiOperation({
    summary: 'Chi tiết yêu cầu tuyển dụng nhân sự đã ứng tuyển (web)',
  })
  async detailAppliedRecruitment(
    @Headers('token') token: any,
    @Param('id') id: number,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.detailAppliedRecruitment(
      id,
      Number(user_id),
    );
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR)
  @Get('/detail-timeline-status/:id')
  @ApiOperation({
    summary:
      'Chi tiết thay đổi trạng thái ứng viên trong yêu cầu tuyển dụng nhân sự sự đã ứng tuyển (web)',
  })
  async detailTimelineStatus(
    @Headers('token') token: any,
    @Param('id') id: number,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.detailTimelineStatus(
      id,
      Number(user_id),
    );
    return result;
  }

  //Ứng viên/cộng tác viên tải file cv từ máy trong quản lí cv
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR)
  @Post('upload-cv-file')
  @ApiOperation({
    summary:
      'Ứng viên/cộng tác viên tải mới file cv từ máy (trạng thái chờ duyệt) (web)',
  })
  async uploadCVFile(@Body() dto: FileCVUpload, @Headers('token') token: any) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.uploadCVFile(
      user_id,
      dto,
    );
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Get('my-interest')
  @ApiOperation({
    summary: 'User lấy thông tin quan tâm đã tạo (web)',
  })
  async getCandidateInterest(@Headers('token') token: any) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.candidateInterestService.getCandidateInterest(
      user_id,
    );
    return result;
  }
}
