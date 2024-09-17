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
import { AdminFilterDetailWalletDto } from '../dto/filter-detail-wallet.dto';
import { AdminUpdateWalletDto } from '../dto/update-wallet.dto';
import { AdminWalletService } from '../service/wallet.service';

@ApiTags('[ADMIN] wallet')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Controller('admin/wallet')
export class AdminWalletController {
  constructor(private readonly adminWalletService: AdminWalletService) {}

  @ApiOperation({
    summary: 'Cập nhật ví doanh nghiệp',
  })
  @ApiResponse({
    description: 'Cập nhật ví doanh nghiệp thành công',
  })
  @Roles(ROLE.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: AdminUpdateWalletDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminWalletService.update(id, dto, user_id);
    return result;
  }

  @ApiOperation({
    summary: 'Chi tiết ví doanh nghiệp',
  })
  @ApiResponse({
    description: 'Chi tiết ví doanh nghiệp',
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
    @Query() dto: AdminFilterDetailWalletDto,
  ) {
    const result = await this.adminWalletService.detail(id, dto);
    return result;
  }
}
