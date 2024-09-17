// Nest dependencies
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
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

// Local files
import { Roles } from '@decorators/roles.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { configService } from '@services/config.service';
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ROLE } from '@utils/constants';
import { CreateEnterPriseAdminDto } from '../dto/create-enterprise-admin.dto';
import { DeleteEnterPriseAdminDto } from '../dto/delete-enterprise-admin.dto';
import {
  AdminFilterRecruitmentOfEnterpriseDto,
  ListEnterpriseAdminDto,
} from '../dto/list-enterprise-admin.dto';
import { UpdateEnterPriseAdminDto } from '../dto/update-enterprise-admin.dto';
import { UpdateEnterpriseStatusDto } from '../dto/update-enterprise-status.dto';
import { EnterpriseService } from '../service/enterprise.service';

@ApiTags('[ADMIN] enterprise')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Controller('admin/enterprise')
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @Roles(
    ROLE.ADMIN,
    ROLE.IMPLEMENTATION_SALE,
    ROLE.RESPONSIBLE_SALE,
    ROLE.HRO,
    ROLE.CANDIDATE,
  )
  @Get(':enterprise_id')
  @ApiOperation({
    summary: 'Chi tiết doanh nghiệp',
    description: 'Trả về chi tiết doanh nghiệp đang có trong hệ thống',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết doanh nghiệp',
  })
  async findOne(
    @Param('enterprise_id', new ValidationPipe()) id: number,
  ): Promise<any> {
    return await this.enterpriseService.findOne(id);
  }

  @Roles(ROLE.ADMIN, ROLE.RESPONSIBLE_SALE, ROLE.IMPLEMENTATION_SALE)
  @Patch('update/:enterprise_id/status')
  @ApiOperation({
    security: [{}],
    summary: 'Cập nhật thông tin doanh nghiệp từ ADMIN',
    description: 'Cập nhật thông tin một doanh nghiệp từ trang ADMIN',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin doanh nghiệp đã cập nhật',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Email, số điện thoại, tax_code đã tồn tại trên hệ thống',
  })
  @ApiResponse({
    status: 500,
    description: 'Lỗi xảy ra bởi server không cập nhật được dữ liệu',
  })
  async updateEnterpriseStatus(
    @Param('enterprise_id', new ValidationPipe()) enterprise_id: number,
    @Body()
    dto: UpdateEnterpriseStatusDto,
  ): Promise<any> {
    return this.enterpriseService.updateEnterpriseStatus(enterprise_id, dto);
  }

  @Roles(ROLE.ADMIN, ROLE.RESPONSIBLE_SALE, ROLE.IMPLEMENTATION_SALE)
  @Patch('update/:enterprise_id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo', configService.getSavFile('image')))
  @ApiOperation({
    security: [{}],
    summary: 'Cập nhật thông tin doanh nghiệp từ ADMIN',
    description: 'Cập nhật thông tin một doanh nghiệp từ trang ADMIN',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin doanh nghiệp đã cập nhật',
  })
  @ApiResponse({
    status: 302,
    description: 'Email, số điện thoại, tax_code đã tồn tại trên hệ thống',
  })
  @ApiResponse({
    status: 500,
    description: 'Lỗi xảy ra bởi server không cập nhật được dữ liệu',
  })
  async updateEnterprise(
    @Param('enterprise_id', new ValidationPipe()) enterprise_id: number,
    @Body() dto: UpdateEnterPriseAdminDto,
  ): Promise<any> {
    return this.enterpriseService.updateEnterprise(enterprise_id, dto);
  }

  @Roles(ROLE.ADMIN, ROLE.RESPONSIBLE_SALE)
  @Post('create')
  @ApiOperation({
    security: [{}],
    summary: 'Tạo mới doanh nghiệp từ ADMIN',
    description: 'Tạo mới một doanh nghiệp từ trang ADMIN',
  })
  @ApiResponse({
    status: 201,
    description: 'Trả về thông tin doanh nghiệp mới tạo',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thành công',
        data: {
          full_name: 'Nguyễn Văn A',
          email: 'nguyenvan111a@gmail.com',
          phone_number: '0988888888',
          alternate_phone: 'null',
          name: 'Công ty cổ phần ABC',
          logo: null,
          description: 'Công ty cổ phần ABCXYZ',
          status: 1,
          tax_code: 'abcxyzvvv',
          website: 'abcxyz',
          linkedin: 'abcxyz',
          facebook: 'abcxyz',
          salesperson: 'Nguyễn Thị A',
          manager: 'Nguyễn Văn A',
          position: 'CEO',
        },
      },
    },
  })
  @ApiResponse({
    status: 302,
    description: 'Email, số điện thoại, tax_code đã tồn tại trên hệ thống',
    schema: {
      example: [
        {
          status: 0,
          code: 302,
          msg: 'Số điện thoại không tồn tại trên hệ thống',
          data: {},
          timestamp: '2023-08-17T03:47:10.418Z',
          path: '/api/admin/enterprise/create',
        },
        {
          status: 0,
          code: 302,
          msg: 'Email đã tồn tại trên hệ thống',
          data: {},
          timestamp: '2023-08-17T03:21:45.917Z',
          path: '/api/admin/enterprise/create',
        },
        {
          status: 0,
          code: 302,
          msg: 'Mã số thuế đã tồn tại trên hệ thống',
          data: {},
          timestamp: '2023-08-17T03:29:22.733Z',
          path: '/api/admin/enterprise/create',
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: {
      example: {
        status: 0,
        code: 404,
        msg: 'Lĩnh vực hoạt động không tồn tại trên hệ thống',
        data: {},
        timestamp: '2023-08-17T03:51:21.255Z',
        path: '/api/admin/enterprise/create',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Lỗi xảy ra bởi server không tạo được dữ liệu mới',
    schema: {
      example: {
        status: 0,
        code: 500,
        msg: 'Có lỗi xảy ra không thể tạo doanh nghiệp lúc này',
        data: {},
        timestamp: '2023-08-17T03:51:21.255Z',
        path: '/api/admin/enterprise/create',
      },
    },
  })
  async createEnterprise(@Body() dto: CreateEnterPriseAdminDto): Promise<any> {
    return this.enterpriseService.createEnterprise(dto);
  }

  @Roles(
    ROLE.ADMIN,
    ROLE.IMPLEMENTATION_SALE,
    ROLE.RESPONSIBLE_SALE,
    ROLE.HRO,
    ROLE.CANDIDATE,
  )
  @Get()
  @ApiOperation({
    summary: 'Danh sách doanh nghiệp',
    description: 'Trả về danh sách doanh nghiệp đang có trong hệ thống',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách doanh nghiệp',
  })
  async findAll(
    @Query(new ValidationPipe({ transform: true })) dto: ListEnterpriseAdminDto,
    @Headers('token') token: any,
  ): Promise<any> {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    return await this.enterpriseService.getEnterprise(user_id, dto);
  }

  @Roles(ROLE.ADMIN)
  @Delete()
  @ApiOperation({
    summary: 'Xóa doanh nghiệp',
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa doanh nghiệp thành công',
  })
  async deleteEnterprise(@Body() dto: DeleteEnterPriseAdminDto): Promise<any> {
    return await this.enterpriseService.deleteEnterprise(dto);
  }

  // Thông tin danh sách các yêu cầu tuyển dụng của doanh nghiệp
  @Roles(
    ROLE.ADMIN,
    ROLE.IMPLEMENTATION_SALE,
    ROLE.RESPONSIBLE_SALE,
    ROLE.HRO,
    ROLE.CANDIDATE,
  )
  @Get('/recruitment/:enterprise_id')
  @ApiOperation({
    summary: 'Danh sách các yêu cầu tuyển dụng của doanh nghiệp',
    description: 'Trả về danh sách các yêu cầu tuyển dụng của doanh nghiệp',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách các yêu cầu tuyển dụng của doanh nghiệp',
  })
  async findAllRecruitmentOfEnterprise(
    @Param('enterprise_id', new ValidationPipe()) id: number,
    @Query() dto: AdminFilterRecruitmentOfEnterpriseDto,
  ): Promise<any> {
    return await this.enterpriseService.findAllRecruitmentOfEnterprise(id, dto);
  }

  @Get('/detail/:id')
  @ApiOperation({
    summary: 'Chi tiết yêu cầu tuyển dụng',
  })
  async detail(@Param('id') id: number) {
    const result = await this.enterpriseService.detailRecruitmentRequirement(
      id,
    );
    return result;
  }
}
