// Nest dependencies
import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

// Local files
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ChangePasswordHRODto } from '../dto/change-password-hro.dto';
import { ForgotPasswordHRODto } from '../dto/forgot-password-hro.dto';
import { LoginAdminDto } from '../dto/login-admin.dto';
import { RegisterHRODto } from '../dto/register-hro.dto';
import { VerifyCodeHRODto } from '../dto/verify-code-hro.dto';
import { AuthAdminService } from '../service/auth-admin.service';

@ApiTags('[ADMIN] auth')
@Controller('admin/auth')
export class AuthAdminController {
  constructor(private readonly authService: AuthAdminService) {}

  @Post('sigin')
  @ApiOperation({
    summary: 'Đăng nhập tài khoản admin',
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
  async sigIn(@Body() dto: LoginAdminDto): Promise<any> {
    const authResponse = await this.authService.sigIn(dto);

    return authResponse;
  }

  @Get('me')
  @ApiSecurity('token')
  @ApiOperation({
    summary: 'Lấy thông tin đăng nhập tài khoản admin',
    description: 'Lấy thông tin đăng nhập tài khoản admin',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin đăng nhập tài khoản admin',
  })
  async getInfo(@Headers('token') token: any): Promise<any> {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const authResponse = await this.authService.getInfo(user_id);

    return authResponse;
  }

  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản hro',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết tài khoản',
  })
  async register(@Body() dto: RegisterHRODto): Promise<any> {
    const authResponse = await this.authService.register(dto);

    return authResponse;
  }

  @Post('forgot/password')
  @ApiOperation({
    summary: 'Quên mật khẩu HRO',
    description:
      'Nhập số điện thoại đăng ký với tài khoản HRO để nhận mã xác nhận cập nhật mật khẩu mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Gửi mã xác nhận về email của HRO',
  })
  @ApiResponse({
    status: 404,
    description: 'Email của HRO không tồn tại trên hệ thống Alehub',
  })
  async forgotPassword(@Body() dto: ForgotPasswordHRODto): Promise<any> {
    return await this.authService.sendCodeForgotPasswordHRO(dto);
  }

  @Post('forgot/password/verify-code')
  @ApiOperation({
    summary: 'verify code forgot password',
    description: 'Nhập code gửi về mail để xác nhận cập nhật mật khẩu mới',
  })
  async verifyCodeForgotPassword(@Body() dto: VerifyCodeHRODto): Promise<any> {
    return await this.authService.verifyCodeForgotPassword(dto);
  }
  @Post('forgot/password/change-password')
  @ApiOperation({
    summary: 'thay đổi mật khẩu',
    description: 'thay đổi mật khẩu',
  })
  async changePasswordForgotPassword(
    @Body() dto: ChangePasswordHRODto,
  ): Promise<any> {
    return await this.authService.changePasswordForgotHRO(dto);
  }
}
