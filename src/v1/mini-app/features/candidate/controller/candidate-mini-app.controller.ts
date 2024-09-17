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
import { MiniAppCandidateService } from '../service/candidate-mini-app.service';
import {
  FilterAppliedRecruitmentDto,
  FilterRecruitmentFavoriteDto,
  RecruitmentIdDto,
} from '../dto/candidate-recruitment.dto';
import { ApplyRecruitmentDto } from '../dto/candidate-apply.dto';
import {
  ApplicationIdDto,
  ChangeCVNameDto,
  CreateApplicationDto,
  DeleteApplicationDto,
  EditApplicationNameDto,
  UpdateApplicationDto,
  updateCVFileDto,
  UpdateWorkExperienceDto,
} from '../dto/application.dto';
import { CandidateFilterDetailWalletDto } from '../dto/filter-detail-wallet.dto';
import { WalletRequirementDto } from '../dto/wallet-requirement.dto';
import { FileCVUpload } from '../dto/application.dto';
import { FilterApplicationDto } from 'src/v1/candidate/features/recruitment/dto/candidate-recruitment.dto';

@ApiTags('[MINI-APP] Candidate')
@Controller('mini-app/candidate')
export class MiniAppCandidateController {
  constructor(
    private readonly miniAppCandidateService: MiniAppCandidateService,
  ) {}

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Post('create-favorite-recruitment')
  @ApiOperation({
    summary: 'Ứng viên/Cộng tác viên lưu tin tuyển dụng yêu thích',
  })
  async createRecruitment(
    @Body() dto: RecruitmentIdDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result =
      await this.miniAppCandidateService.handleFavoriteRecruitmentRequirement(
        user_id,
        dto,
      );
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Get('get-favorite-recruitments')
  @ApiOperation({
    summary: 'Ứng viên/Cộng tác viên lấy danh sách tuyển dụng yêu thích',
  })
  async getMyFavoriteRecruitments(
    @Headers('token') token: any,
    @Query() dto: FilterRecruitmentFavoriteDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.getMyRecruitmentFavorites(
      user_id,
      dto,
    );
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR)
  @Get('get-applied-recruitments')
  @ApiOperation({
    summary: 'Ứng viên/Cộng tác viên lấy danh sách tuyển dụng đã ứng tuyển',
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
    summary: 'Chi tiết yêu cầu tuyển dụng nhân sự đã ứng tuyển',
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
      'Chi tiết thay đổi trạng thái ứng viên trong yêu cầu tuyển dụng nhân sự sự đã ứng tuyển',
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

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Post('apply-cv')
  @ApiOperation({
    summary: 'Ứng viên/Cộng tác viên ứng tuyển cv',
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

  //Hồ sơ ứng viên/cộng tác viên
  //Tạo hoặc cập nhật nếu có
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Post('handle-application')
  @ApiOperation({
    summary: 'Ứng viên/Cộng tác viên tạo hoặc cập nhật hồ sơ',
  })
  async handleApplication(
    @Body() dto: CreateApplicationDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.handleApplication(
      user_id,
      dto,
    );
    return result;
  }

  //Tạo
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Post('create-application')
  @ApiOperation({
    summary: 'Ứng viên/Cộng tác viên tạo mới hồ sơ',
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
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Post('update-application')
  @ApiOperation({
    summary: 'Ứng viên/Cộng tác viên cập nhật hồ sơ',
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

  //Cập nhật kinh nghiệm làm việc
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Post('update-work-experience')
  @ApiOperation({
    summary: 'Ứng viên/Cộng tác viên cập nhật kinh nghiệm làm việc',
  })
  async updateWorkExperience(
    @Body() dto: UpdateWorkExperienceDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.updateWorkExperience(
      user_id,
      dto,
    );
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Get('my-application')
  @ApiOperation({
    summary: 'Ứng viên/Cộng tác viên lấy thông tin chi tiết hồ sơ',
  })
  async getMyApplication(@Headers('token') token: any) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.getMyApplication(user_id);
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Get('main-cv')
  @ApiOperation({
    summary: 'Ứng viên/Cộng tác viên lấy chi tiết hồ sơ bản pdf',
  })
  async getMainCv(@Headers('token') token: any) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.getMainCv(user_id);
    return result;
  }

  //Cập nhật
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Post('update-cv-file')
  @ApiOperation({
    summary: 'Ứng viên/Cộng tác viên cập nhật file pdf của hồ sơ tương ứng',
  })
  async updateCVFile(
    @Body() dto: updateCVFileDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.updateCVFile(
      user_id,
      dto,
    );
    return result;
  }

  //Ví ứng viên/cộng tác viên (hiện tại chỉ áp dụng cho cộng tác viên)
  @ApiOperation({
    summary: 'Chi tiết ví Ứng viên/Cộng tác viên',
  })
  @ApiResponse({
    description: 'Chi tiết ví Ứng viên/Cộng tác viên',
  })
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR)
  @Get('wallet/:id')
  async detail(
    @Param('id') id: number,
    @Query() dto: CandidateFilterDetailWalletDto,
  ) {
    const result = await this.miniAppCandidateService.detailWallet(id, dto);
    return result;
  }

  @ApiOperation({
    summary: 'Yêu cầu rút tiền ví hoa hồng của ứng viên/cộng tác viên',
  })
  @ApiResponse({
    description: 'Yêu cầu rút tiền ví hoa hồng của ứng viên/cộng tác viên',
  })
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR)
  @Post('wallet-requirement')
  async walletRequirement(
    @Headers('token') token: any,
    @Body() dto: WalletRequirementDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.sendWalletRequirement(
      user_id,
      dto,
    );
    return result;
  }

  //Lịch sử yêu cầu rút tiền của ứng viên/cộng tác viên
  @ApiOperation({
    summary: 'Lịch sử yêu cầu rút tiền của ứng viên/cộng tác viên',
  })
  @ApiResponse({
    description: 'Lịch sử yêu cầu rút tiền của ứng viên/cộng tác viên',
  })
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR)
  @Get('wallet-requirement-history/:id')
  async walletRequirementHistory(
    @Param('id') id: number,
    @Query() dto: CandidateFilterDetailWalletDto,
  ) {
    const result = await this.miniAppCandidateService.walletRequirementHistory(
      id,
      dto,
    );
    return result;
  }

  //Thông tin lần rút tiền gần nhất của ứng viên/cộng tác viên
  @ApiOperation({
    summary: 'Thông tin lần rút tiền gần nhất của ứng viên/cộng tác viên',
  })
  @ApiResponse({
    description: 'Thông tin lần rút tiền gần nhất của ứng viên/cộng tác viên',
  })
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR)
  @Get('wallet-requirement-recently')
  async walletRequirementRecently(@Headers('token') token: any) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.walletRequirementRecently(
      user_id,
    );
    return result;
  }

  //Danh sách hồ sơ của ứng viên
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.ADMIN, ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Get('my-application-list')
  @ApiOperation({
    summary: 'Ứng viên/Cộng tác viên lấy danh sách hồ sơ',
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
  @Roles(ROLE.ADMIN, ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Get('my-cv-uploadeds')
  @ApiOperation({
    summary: 'Ứng viên/Cộng tác viên lấy danh sách cv đã tải lên từ máy',
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

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Get('detail-application/:id')
  @ApiOperation({
    summary:
      'Ứng viên/Cộng tác viên lấy thông tin chi tiết hồ sơ (từ danh sách hồ sơ)',
  })
  async detailApplicationFromList(@Param('id') id: number) {
    const result =
      await this.miniAppCandidateService.getDetailApplicationFromList(id);
    return result;
  }

  //Xoá hồ sơ
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Delete('delete-application/:id')
  @ApiOperation({
    summary: 'Ứng viên/Cộng tác viên xoá hồ sơ',
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

  //Sửa tên hồ sơ
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.HRO)
  @Patch('edit-application-name')
  @ApiOperation({
    summary: 'Ứng viên/Cộng tác sửa tên hồ sơ',
  })
  async editApplicationName(
    @Body() dto: EditApplicationNameDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.editApplicationName(
      user_id,
      dto,
    );
    return result;
  }

  //Chọn hồ sơ chính
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Post('choose-main-application')
  @ApiOperation({
    summary: 'Ứng viên/Cộng tác viên chọn hồ sơ chính',
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

  //Ứng viên/cộng tác viên đổi tên file (file đã upload)
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Post('change-cv-name')
  @ApiOperation({
    summary: 'Ứng viên/cộng tác viên cập nhật tên cv',
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

  //Ứng viên/cộng tác viên tải file cv từ máy trong quản lí cv
  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR)
  @Post('upload-cv-file')
  @ApiOperation({
    summary:
      'Ứng viên/cộng tác viên tải mới file cv từ máy (trạng thái chờ duyệt)',
  })
  async uploadCVFile(@Body() dto: FileCVUpload, @Headers('token') token: any) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.miniAppCandidateService.uploadCVFile(
      user_id,
      dto,
    );
    return result;
  }
}
