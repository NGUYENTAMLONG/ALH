// Nest dependencies
import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
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
import { AdminFilterDetailUserPointDto } from '../dto/filter-detail-user-point.dto';
import { AdminUpdateUserPointDto } from '../dto/update-wallet.dto';
import { AdminUserPointService } from '../service/user-point.service';

@ApiTags('[ADMIN] user point')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Controller('admin/user-point')
export class AdminUserPointController {
  constructor(private readonly adminUserPointService: AdminUserPointService) {}

  @ApiOperation({
    summary: 'Cập nhật điểm',
  })
  @ApiResponse({
    description: 'Cập nhật điểm',
  })
  @Roles(ROLE.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: AdminUpdateUserPointDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminUserPointService.update(id, dto, user_id);
    return result;
  }

  @ApiOperation({
    summary: 'Chi tiết điểm',
  })
  @ApiResponse({
    description: 'Chi tiết điểm',
  })
  @Roles(
    ROLE.ADMIN,
    ROLE.IMPLEMENTATION_SALE,
    ROLE.RESPONSIBLE_SALE,
    ROLE.HRO,
    ROLE.CANDIDATE,
  )
  @Get(':id')
  async detail(
    @Param('id') id: number,
    @Query() dto: AdminFilterDetailUserPointDto,
  ) {
    const result = await this.adminUserPointService.detail(id, dto);
    return result;
  }
}
