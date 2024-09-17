//Nest dependencies
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
// Local files
import { Roles } from '@decorators/roles.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { ROLE } from '@utils/constants';
import { AdminFilterRecruitmentDto } from '../dto/filter-wallet-requirement.dto';
import { AdminUpdateStatusWalletRequirementDto } from '../dto/wallet-requiment.dto';
import { AdminWalletRequirementService } from '../service/admin-wallet-requirement.service';

@ApiTags('[ADMIN] wallet requirement')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ADMIN)
@Controller('admin/wallet-requirement')
export class AdminWalletRequirementController {
  constructor(
    private readonly adminWalletRequirementService: AdminWalletRequirementService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách yêu cầu rút tiền',
  })
  findAll(@Query() dto: AdminFilterRecruitmentDto) {
    return this.adminWalletRequirementService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Chi tiết yêu cầu rút tiền',
  })
  detail(@Param('id') id: number) {
    return this.adminWalletRequirementService.detail(id);
  }

  @Patch()
  @ApiOperation({
    summary: 'Thay đổi trạng thái yêu cầu rút tiền từ ví của ứng viên',
  })
  async changeStatus(@Body() dto: AdminUpdateStatusWalletRequirementDto) {
    const result = await this.adminWalletRequirementService.changeStatus(dto);
    return result;
  }

  @Post('resolve-all')
  @ApiOperation({
    summary:
      'Phê duyệt toàn bộ yêu cầu rút tiền (đổi trạng thái toàn bộ yêu cầu thành )',
  })
  async resolveAllWalletRequirement() {
    const result =
      await this.adminWalletRequirementService.resolveAllWalletRequirement();
    return result;
  }
}
