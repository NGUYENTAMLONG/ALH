// Nest dependencies
import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
// Local files
import { Roles } from '@decorators/roles.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ROLE } from '@utils/constants';
import { EnterpriseCreateTrackingDto } from '../dto/create-tracking.dto';
import { EnterpriseTrackingService } from '../service/tracking.service';

@ApiTags('[ENTERPRISE] tracking')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ENTERPRISE)
@Controller('enterprise/tracking')
export class EnterpriseTrackingController {
  constructor(
    private readonly enterpriseTrackingService: EnterpriseTrackingService,
  ) {}

  @ApiOperation({
    summary: 'Tạo tracking',
  })
  @Post()
  async create(
    @Body() dto: EnterpriseCreateTrackingDto,
    @Headers('token') token: any,
  ) {
    const id = jwtManipulationService.decodeJwtToken(token, 'id');

    const response = await this.enterpriseTrackingService.create(id, dto);

    return response;
  }
}
