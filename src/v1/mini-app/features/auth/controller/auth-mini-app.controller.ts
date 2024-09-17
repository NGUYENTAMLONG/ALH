// Nest dependencies
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

// Local files
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { RegisterHROMiniAppDto } from '../dto/register-hro-mini-app.dto';
import { RegisterCandidateMiniAppDto } from '../dto/register-candidate-mini-app.dto';
import { LoginByQRDto, LoginMiniAppDto } from '../dto/login-mini-app.dto';
import { AuthMiniAppService } from '../service/auth-mini-app.service';
import { CreateCareerFavoriteDto } from '../dto/create-career-favorite.dto';
import { AcceptReceiveNotiDto } from '../dto/accept-receive-noti.dto';
import {
  UpdateAccountInformationDto,
  UpdateEnterpriseInformationDto,
} from '../dto/update-information.dto';
import { sendSuccess } from '@utils/send-success';
import { switchAutoSaveSearchingData } from '@utils/save-searching';

@ApiTags('[MINI-APP] auth')
@Controller('mini-app/auth')
export class AuthMiniAppController {
  constructor(private readonly authService: AuthMiniAppService) {}

  @Post('sign-in')
  @ApiOperation({
    summary: 'Đăng nhập tài khoản trên mini app',
    description:
      'Nhập email và mật khẩu được cung cấp để truy cập vào hệ thống',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về access_token cho người dùng',
  })
  @ApiResponse({
    status: 401,
    description: 'Mật người dùng điền không đúng',
  })
  @ApiResponse({
    status: 404,
    description: 'Người dùng không tồn tại trên hệ thống',
  })
  async signInOnMiniApp(@Body() dto: LoginMiniAppDto): Promise<any> {
    const authResponse = await this.authService.signInOnMiniApp(dto);

    return authResponse;
  }

  @Get('me')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Lấy thông tin đăng nhập tài khoản',
    description: 'Lấy thông tin đăng nhập tài khoản',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin đăng nhập tài khoản',
  })
  async getInfo(@Headers('token') token: any): Promise<any> {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const authResponse = await this.authService.getInfo(user_id);

    return authResponse;
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

  @Get('enterprise')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Lấy thông công ty/doanh nghiệp',
    description: 'Lấy thông công ty/doanh nghiệp',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin công ty doanh nghiệp đã tạo',
  })
  async getEnterprise(@Headers('token') token: any): Promise<any> {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const authResponse = await this.authService.getEnterprise(user_id);

    return authResponse;
  }

  @Post('hro/register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản hro trên mini app',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết tài khoản',
  })
  async registerHRO(@Body() dto: RegisterHROMiniAppDto): Promise<any> {
    const authResponse = await this.authService.registerHROMiniApp(dto);

    return authResponse;
  }

  @Post('candidate/register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản ứng viên trên mini app',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết tài khoản',
  })
  async registerCandidate(
    @Body() dto: RegisterCandidateMiniAppDto,
  ): Promise<any> {
    const authResponse = await this.authService.registerCandidateMiniApp(dto);

    return authResponse;
  }

  @Post('collaborator/register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản cộng tác viên trên mini app',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết tài khoản',
  })
  async registerCollaborator(
    @Body() dto: RegisterCandidateMiniAppDto,
  ): Promise<any> {
    const authResponse = await this.authService.registerCollaboratorMiniApp(
      dto,
    );

    return authResponse;
  }

  @Post('user-career-favorite')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Tạo nghề nghiệp quan tâm',
    description: 'Tạo nghề nghiệp quan tâm',
  })
  @ApiResponse({
    status: 200,
    description:
      'Trả về kết quả tạo danh sách nghề nghiệp quan tâm đối của user',
  })
  async createCareerFavorite(
    @Headers('token') token: any,
    @Body() dto: CreateCareerFavoriteDto,
  ): Promise<any> {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    return this.authService.createCareerFavorite(user_id, dto);
  }

  @Post('accept-receive-notification')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Chấp nhận nhận thông báo từ hệ thống',
    description: 'Chấp nhận nhận thông báo từ hệ thống',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về kết quả xác nhận nhận thông báo từ hệ thống',
  })
  async acceptReceiveNotification(
    @Headers('token') token: any,
    @Body() dto: AcceptReceiveNotiDto,
  ): Promise<any> {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    return this.authService.acceptReceiveNotification(user_id, dto);
  }

  @Post('update-information')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Cập nhật thông tin cá nhân',
    description: 'Cập nhật thông tin cá nhân',
  })
  @ApiResponse({
    status: 200,
    description:
      'Trả về kết quả cập nhật thông tin cá nhân (HRO hoặc Ứng viên)',
  })
  async updateAccountInformation(
    @Headers('token') token: any,
    @Body() dto: UpdateAccountInformationDto,
  ): Promise<any> {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    return this.authService.updateAccountInformation(user_id, dto);
  }

  @Post('update-enterprise-information')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Cập nhật thông tin công ty/doanh nghiệp',
    description: 'Cập nhật thông tin công ty/doanh nghiệp',
  })
  @ApiResponse({
    status: 200,
    description:
      'Trả về kết quả cập nhật thông tin công ty/doanh nghiệp (HRO đã tạo trước đó)',
  })
  async updateEnterpriseInformation(
    @Headers('token') token: any,
    @Body() dto: UpdateEnterpriseInformationDto,
  ): Promise<any> {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    return this.authService.updateEnterpriseInformation(user_id, dto);
  }

  @Delete('/delete-my-account/:id')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Xóa tài khoản của mình trên app',
    description: 'Xóa tài khoản của mình trên app',
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa tài khoản thành công',
  })
  async deleteAccount(@Headers('token') token: any): Promise<any> {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const user = await this.authService.deleteAccount(user_id);
    return user;
  }

  //QR Login
  @Get('login-by-qr')
  async loginByQR(@Query() dto: LoginByQRDto): Promise<any> {
    const authResponse = await this.authService.loginByQR(dto);
    return authResponse;
  }

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
}
