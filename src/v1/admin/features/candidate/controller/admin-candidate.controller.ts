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
import { AdminCreateCandidateDto } from '../dto/admin-create-candidate.dto';
import { AdminDeleteCandidateDto } from '../dto/admin-delete-candidate.dto';
import { AdminUpdateCandidateDto } from '../dto/admin-update-candidate.dto';
import { AdminUpdateStatusCandidateDto } from '../dto/admin-update-status-candidate.dto';
import { FilterAdminCandidate } from '../dto/filter-admin-candidate.dto';
import { AdminCandidateService } from '../service/admin-candidate.service';
import { FilterApplicationDto } from 'src/v1/mini-app/features/candidate/dto/candidate-recruitment.dto';

@ApiTags('ADMIN Candidate')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(
  ROLE.ADMIN,
  ROLE.HRO,
  ROLE.IMPLEMENTATION_SALE,
  ROLE.RESPONSIBLE_SALE,
  ROLE.CANDIDATE,
)
@Controller('admin/candidate')
export class AdminCandidateController {
  constructor(private readonly adminCandidateService: AdminCandidateService) {}
  @Post()
  @ApiOperation({
    summary: 'Tạo hồ sơ ứng viên',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết ứng viên',
  })
  async create(
    @Headers('token') token: any,
    @Body() dto: AdminCreateCandidateDto,
  ): Promise<any> {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const candidate = await this.adminCandidateService.create(user_id, dto);
    return candidate;
  }

  @Get()
  @ApiOperation({
    summary: 'danh sách ứng viên/cộng tác viên',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách ứng viên/cộng tác viên',
  })
  async getListCandidate(
    @Headers('token') token: any,
    @Query() dto: FilterAdminCandidate,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const candidates = await this.adminCandidateService.listCandidate(
      user_id,
      dto,
    );
    return candidates;
  }

  @Get(':id/applications')
  @ApiOperation({
    summary: 'Danh sách hồ sơ của ứng viên',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách hồ sơ của ứng viên',
  })
  findAllApplicationOfCandidate(
    @Param('id') id: number,
    @Query() dto: FilterApplicationDto,
  ) {
    return this.adminCandidateService.applicationListOfCandidate(id, dto);
  }

  @Get(':id/applications/upload-from-device')
  @ApiOperation({
    summary: 'Danh sách hồ sơ tải lên từ máy của ứng viên',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách hồ sơ tải lên từ máy của ứng viên',
  })
  findAllApplicationUploadedFromDevice(
    @Param('id') id: number,
    @Query() dto: FilterApplicationDto,
  ) {
    return this.adminCandidateService.applicationUploadFromDeviceOfCandidate(
      id,
      dto,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Chi tiết ứng viên/cộng tác viên',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết ứng viên',
    schema: {
      example: {
        status: 1,
        code: 200,
        data: {
          id: 1,
          user_id: 64,
          years_of_experience_id: 1,
          professional_field_id: 1,
          df_province_id: 101,
          salary_range_id: 1,
          status: 3,
          note: 'ứng viên tốt',
          created_at: '2023-08-25T07:29:54.000Z',
          updated_at: '2023-08-26T07:30:46.000Z',
          deleted_at: null,
        },
      },
    },
  })
  findOne(@Param('id') id: number) {
    return this.adminCandidateService.detailCandidate(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Thay đổi trạng thái của ứng viên',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết ứng viên',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thay đổi trạng thái ứng viên thành công',
        data: {
          id: 1,
          user_id: 64,
          years_of_experience_id: 1,
          professional_field_id: 1,
          df_province_id: 101,
          salary_range_id: 1,
          status: 1,
          note: 'ứng viên tốt',
          created_at: '2023-08-25T07:29:54.000Z',
          updated_at: '2023-08-26T07:30:46.000Z',
          deleted_at: null,
        },
      },
    },
  })
  async updateStatus(
    @Param('id') id: number,
    @Body() dto: AdminUpdateStatusCandidateDto,
  ) {
    const candidate = await this.adminCandidateService.updateCandidateStatus(
      id,
      dto,
    );
    return candidate;
  }

  @Patch(':id/reset_password')
  @ApiOperation({
    summary: 'Reset mật khẩu của ứng viên',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết ứng viên',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Reset mật khẩu ứng viên thành công',
        data: {
          id: 1,
          user_id: 64,
          years_of_experience_id: 1,
          professional_field_id: 1,
          df_province_id: 101,
          salary_range_id: 1,
          status: 1,
          note: 'ứng viên tốt',
          created_at: '2023-08-25T07:29:54.000Z',
          updated_at: '2023-08-26T07:30:46.000Z',
          deleted_at: null,
        },
      },
    },
  })
  async resetPassword(@Param('id') id: number) {
    const candidate = await this.adminCandidateService.resetPassword(id);
    return candidate;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật ứng viên',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết ứng viên',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Cập nhật ứng viên thành công',
        data: {
          id: 1,
          user_id: 64,
          years_of_experience_id: 1,
          professional_field_id: 1,
          df_province_id: 101,
          salary_range_id: 1,
          status: 1,
          note: 'ứng viên tốt',
          created_at: '2023-08-25T07:29:54.000Z',
          updated_at: '2023-08-26T07:30:46.000Z',
          deleted_at: null,
        },
      },
    },
  })
  async updateCandidate(
    @Param('id') id: number,
    @Body() dto: AdminUpdateCandidateDto,
  ) {
    const candidate = await this.adminCandidateService.updateCandidate(id, dto);
    return candidate;
  }

  @Delete()
  @ApiOperation({
    summary: 'Xóa ứng viên',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Xoá ứng viên thành công',
        data: {
          id: 1,
        },
      },
    },
  })
  delete(@Headers('token') token: any, @Body() dto: AdminDeleteCandidateDto) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    return this.adminCandidateService.delete(user_id, dto);
  }
}
