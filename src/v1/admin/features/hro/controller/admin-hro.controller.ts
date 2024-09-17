import { Delete, Param } from '@nestjs/common';
// Nest dependencies
import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

// Local files
import { Roles } from '@decorators/roles.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { ROLE } from '@utils/constants';
import { AdminUpdateHROUserDto } from '../dto/admin-update-user.dto';
import { FilterAdminHRODto } from '../dto/filter-admin-admin.dto';
import { AdminHROService } from '../service/admin-hro.service';

@ApiTags('[ADMIN] HRO')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Controller('admin/hro')
export class AdminHROController {
  constructor(private readonly adminHROService: AdminHROService) {}
  @Roles(ROLE.ADMIN, ROLE.IMPLEMENTATION_SALE, ROLE.RESPONSIBLE_SALE)
  @Get()
  @ApiOperation({
    summary: 'Danh sách tài khoản hro',
    description: 'Danh sách tài khoản hro',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách tài khoản',
  })
  async findAll(@Query() dto: FilterAdminHRODto): Promise<any> {
    const user = await this.adminHROService.findAll(dto);
    return user;
  }

  @Roles(ROLE.ADMIN, ROLE.IMPLEMENTATION_SALE, ROLE.RESPONSIBLE_SALE)
  @Get(':id')
  @ApiOperation({
    summary: 'Chi tiết tài khoản ',
    description: 'Chi tiết tài khoản',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về Chi tiết tài khoản',
  })
  async detail(@Param('id') id: number): Promise<any> {
    const user = await this.adminHROService.detail(id);
    return user;
  }

  @Roles(ROLE.ADMIN, ROLE.IMPLEMENTATION_SALE)
  @Patch('/change-status')
  @ApiOperation({
    summary: 'Cập nhật tài khoản admin',
    description: 'Cập nhật tài khoản admin',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết tài khoản',
  })
  async update(@Body() dto: AdminUpdateHROUserDto): Promise<any> {
    const result = await this.adminHROService.changeStatus(dto);
    return result;
  }

  @Roles(ROLE.ADMIN, ROLE.IMPLEMENTATION_SALE)
  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa yêu cầu đăng ký hro',
    description: 'Xóa yêu cầu đăng ký hro',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  async delete(@Param('id') id: number): Promise<any> {
    const result = await this.adminHROService.delete(id);
    return result;
  }
}
