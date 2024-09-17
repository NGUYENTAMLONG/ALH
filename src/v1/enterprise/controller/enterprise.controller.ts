// Nest dependencies
import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

// Local files
import { Roles } from '@decorators/roles.decorator';
import { UpdateEnterpriseLogoDto } from '@enterprise/dto/update-enterprise-logo.dto';
import { UpdateEnterpriseDto } from '@enterprise/dto/update-enterprise.dto';
import { EnterpriseService } from '@enterprise/service/enterprise.service';
import { AuthGuard } from '@guards/auth.guard';
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ROLE } from '@utils/constants';

@ApiTags('[ENTERPRISE] information')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ENTERPRISE)
@Controller('enterprise')
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @Get()
  @ApiOperation({
    summary: 'Thông tin chi tiết cả doanh nghiệp',
  })
  async findOne(@Headers('token') token: any) {
    const id = jwtManipulationService.decodeJwtToken(token, 'id');

    return await this.enterpriseService.findOne(id);
  }

  @Patch()
  @ApiOperation({
    summary: 'Cập nhật thông tin của doanh nghiệp',
  })
  async update(@Headers('token') token: any, @Body() dto: UpdateEnterpriseDto) {
    const id = jwtManipulationService.decodeJwtToken(token, 'id');

    return await this.enterpriseService.update(id, dto);
  }

  @Patch('update-logo')
  @ApiOperation({
    summary: 'Cập nhật logo của doanh nghiệp',
  })
  async updateLogo(
    @Headers('token') token: any,
    @Body() dto: UpdateEnterpriseLogoDto,
  ) {
    const id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.enterpriseService.updateLogo(id, dto);
    return result;
  }
}
