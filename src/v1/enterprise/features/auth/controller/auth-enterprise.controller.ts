// Nest dependencies
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// Local files
import { CreateEnterpriseUserDto } from '../dto/create-enterprise-user.dto';
import { ForgotPasswordEnterPriseDto } from '../dto/forgot-password-enterprise.dto';
import { ForgotPasswordVerifyEnterpriseDto } from '../dto/forgot-password-verify-enterpise.dto';
import { EnterpriseLoginDto } from '../dto/login-enterprise.dto';
import { AuthEnterpriseService } from '../service/auth-enterprise.service';

@ApiTags('[ENTERPRISE] auth')
@Controller('enterprise')
export class AuthEnterpriseController {
  constructor(private readonly authService: AuthEnterpriseService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản doanh nghiệp',
    description:
      'Điền các thông tin cần thiết để tạo tài khoản của doanh nghiệp',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo tài khoản doanh nghiệp thành công',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thành công',
        data: {
          avatar: null,
          gender_id: 3,
          id: 35,
          role_id: 2,
          full_name: 'Nguyễn Văn A',
          email: 'congtycpsky@gmail.com',
          phone_number: '0987654311',
          alternate_phone: null,
          updated_at: '2023-08-17T02:35:43.511Z',
          created_at: '2023-08-17T02:35:43.511Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Số điện thoại đã tồn tại trên hệ thống',
    schema: {
      example: {
        status: 0,
        code: 302,
        msg: 'Số điện thoại đã tồn tại, vui lòng chọn số khác',
        data: {},
        timestamp: '2023-08-17T02:21:02.969Z',
        path: '/api/enterprise/register',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description:
      'Server đang gặp vấn đề không thể tạo tài khoản doanh nghiệp lúc này',
    schema: {
      example: {
        status: 0,
        code: 500,
        msg: 'Có lỗi xảy ra không thể tạo doanh nghiệp lúc này',
        data: {},
        timestamp: '2023-08-17T02:47:13.498Z',
        path: '/api/enterprise/register',
      },
    },
  })
  async registerEnterPrise(@Body() dto: CreateEnterpriseUserDto): Promise<any> {
    return await this.authService.createUserWithRole(dto);
  }

  @Post('forgot/password/verify')
  @ApiOperation({
    summary: 'Xác nhận mật khẩu mới của doanh nghiệp',
    description:
      'Nhập mã xác nhận, mật khẩu mới, id của người dùng để cập nhật mật khẩu mới của doanh nghiệp',
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
    @Body() dto: ForgotPasswordVerifyEnterpriseDto,
  ): Promise<any> {
    return await this.authService.verifyCodeForgotPasswordEnterprise(dto);
  }

  @Post('forgot/password')
  @ApiOperation({
    summary: 'Quên mật khẩu Doanh nghiệp',
    description:
      'Nhập số điện thoại đăng ký với tài khoản doanh nghiệp để nhận mã xác nhận cập nhật mật khẩu mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Gửi mã xác nhận về email của doanh nghiệp',
  })
  @ApiResponse({
    status: 404,
    description: 'Email của doanh nghiệp không tồn tại trên hệ thống Alehub',
  })
  async forgotPassword(@Body() dto: ForgotPasswordEnterPriseDto): Promise<any> {
    return await this.authService.sendCodeForgotPasswordEnterPrise(dto);
  }

  @Post('sigin')
  @ApiOperation({
    summary: 'Đăng nhập tài khoản doanh nghiệp',
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
  async sigIn(@Body() dto: EnterpriseLoginDto): Promise<any> {
    const authResponse = await this.authService.sigIn(dto);

    return authResponse;
  }
}
