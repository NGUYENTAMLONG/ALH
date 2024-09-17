import { Delete, Param } from '@nestjs/common';
// Nest dependencies
import {
  Body,
  Controller,
  Get,
  Headers,
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
import { AuthGuard } from '@guards/auth.guard';
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ROLE } from '@utils/constants';
import { AdminCreateUserDto } from '../dto/admin-create-user.dto';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto';
import { FilterAdminAdminDto } from '../dto/filter-admin-admin.dto';
import { AdminFilterDetailUserDto } from '../dto/filter-detail-user.dto';
import { AdminAdminService } from '../service/admin-admin.service';

@ApiTags('[ADMIN] admin')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Controller('admin/admin')
export class AdminAdminController {
  constructor(private readonly adminAdminService: AdminAdminService) {}
  @Roles(ROLE.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Tạo tài khoản admin',
    description: 'Tạo tài khoản admin',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết user',
  })
  async create(
    @Body() dto: AdminCreateUserDto,
    @Headers('token') token: any,
  ): Promise<any> {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const user = await this.adminAdminService.create(user_id, dto);
    return user;
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
    summary: 'Danh sách tài khoản admin',
    description: 'Danh sách tài khoản admin',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách tài khoản',
  })
  async findAll(
    @Headers('token') token: any,
    @Query() dto: FilterAdminAdminDto,
  ): Promise<any> {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const user = await this.adminAdminService.findAll(user_id, dto);
    return user;
  }

  @Roles(ROLE.ADMIN, ROLE.IMPLEMENTATION_SALE, ROLE.RESPONSIBLE_SALE)
  @Get(':id')
  @ApiOperation({
    summary: 'Chi tiết tài khoản admin',
    description: 'Chi tiết tài khoản admin',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về Chi tiết tài khoản',
  })
  async detail(
    @Param('id') id: number,
    @Query() dto: AdminFilterDetailUserDto,
  ): Promise<any> {
    const user = await this.adminAdminService.detail(id, dto);
    return user;
  }

  @Roles(ROLE.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật tài khoản admin',
    description: 'Cập nhật tài khoản admin',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết tài khoản',
  })
  async update(
    @Param('id') id: number,
    @Body() dto: AdminUpdateUserDto,
    @Headers('token') token: any,
  ): Promise<any> {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const user = await this.adminAdminService.update(id, dto, user_id);
    return user;
  }

  @Roles(ROLE.ADMIN)
  @Patch(':id/reset-password')
  @ApiOperation({
    summary: 'Reset tài khoản admin',
    description: 'Reset tài khoản admin',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết tài khoản',
  })
  async resetPassword(@Param('id') id: number): Promise<any> {
    const user = await this.adminAdminService.resetPassword(id);
    return user;
  }

  @Roles(ROLE.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa tài khoản admin',
    description: 'Xóa tài khoản admin',
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa tài khoản thành công',
  })
  async delete(@Param('id') id: number): Promise<any> {
    const user = await this.adminAdminService.delete(id);
    return user;
  }
}
