// Nest dependencies
import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// Local files
import { ForgotPasswordVerifyCandidateDto } from '../dto/forgot-password-verify-candidate.dto';
import { CandidateLoginDto, LoginByQRDto } from '../dto/login-candidate.dto';
import { AuthCandidateService } from '../service/auth-candidate.service';
import { RegisterCandidateDto } from '../dto/register-candidate.dto';

@ApiTags('[CANDIDATE] auth')
@Controller('candidate')
export class AuthCandidateController {
  constructor(private readonly authService: AuthCandidateService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản ứng viên',
    description: 'Điền các thông tin cần thiết để tạo tài khoản của ứng viên',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo tài khoản ứng viến thành công',
    schema: {},
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Số điện thoại đã tồn tại trên hệ thống',
    schema: {},
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description:
      'Server đang gặp vấn đề không thể tạo tài khoản ứng viên lúc này',
    schema: {
      example: {
        status: 0,
        code: 500,
        msg: 'Có lỗi xảy ra không thể tạo ứng viên lúc này',
        data: {},
        timestamp: '2023-08-17T02:47:13.498Z',
        path: '/api/candidate/register',
      },
    },
  })
  async registerEnterPrise(@Body() dto: RegisterCandidateDto): Promise<any> {
    return await this.authService.registerCandidate(dto);
  }

  @Post('forgot/password/verify')
  @ApiOperation({
    summary: 'Xác nhận mật khẩu mới của ứng viên',
    description:
      'Nhập mã xác nhận, mật khẩu mới, id của người dùng để cập nhật mật khẩu mới của ứng viên',
  })
  @ApiResponse({
    status: 200,
    description: 'Xác nhận mật khẩu mới thành công',
  })
  @ApiResponse({
    status: 404,
    description: 'Người dùng không tồn tại',
  })
  @ApiResponse({
    status: 401,
    description: 'Mã xác nhận không tồn tại trên hệ thống',
  })
  @ApiResponse({
    status: 500,
    description: 'Lỗi server không thể cập nhật mật khẩu mới',
  })
  async forgotPasswordVerify(
    @Body() dto: ForgotPasswordVerifyCandidateDto,
  ): Promise<any> {
    return await this.authService.verifyCodeForgotPasswordEnterprise(dto);
  }

  // @Post('forgot/password')
  // @ApiOperation({
  //   summary: 'Quên mật khẩu Doanh nghiệp',
  //   description:
  //     'Nhập số điện thoại đăng ký với tài khoản ứng viên để nhận mã xác nhận cập nhật mật khẩu mới',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Gửi mã xác nhận về email của ứng viên',
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Email của ứng viên không tồn tại trên hệ thống Alehub',
  // })
  // async forgotPassword(@Body() dto: ForgotPasswordEnterPriseDto): Promise<any> {
  //   return await this.authService.sendCodeForgotPasswordEnterPrise(dto);
  // }

  @Post('sign-in')
  @ApiOperation({
    summary: 'Đăng nhập tài khoản ứng viên',
    security: [{}],
    description:
      'Nhập số điện thoại và mật khẩu đã đăng ký để truy cập vào hệ thống',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về access_token cho người dùng',
  })
  @ApiResponse({
    status: 401,
    description:
      'Người dùng không tồn tại trên hệ thống hoặc Mật khẩu không đúng vui lòng thử lại',
  })
  async signIn(@Body() dto: CandidateLoginDto): Promise<any> {
    const authResponse = await this.authService.signIn(dto);

    return authResponse;
  }

  //QR Login
  @Get('login-by-qr')
  async loginByQR(@Query() dto: LoginByQRDto): Promise<any> {
    const authResponse = await this.authService.loginByQR(dto);
    return authResponse;
  }
}
