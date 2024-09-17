// Nest dependencies
import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common';
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
import { EnterpriseFilterDetailWalletDto } from '../dto/filter-detail-wallet.dto';
import { EnterpriseWalletService } from '../service/wallet.service';

@ApiTags('[ENTERPRISE] wallet')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ENTERPRISE)
@Controller('enterprise/wallet')
export class EnterpriseWalletController {
  constructor(
    private readonly enterpriseWalletService: EnterpriseWalletService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Lịch sử ví',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách  lịch sử ví',
  })
  async historyWWallet(
    @Query() dto: EnterpriseFilterDetailWalletDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.enterpriseWalletService.getAllHistory(
      user_id,
      dto,
    );
    return result;
  }
}
