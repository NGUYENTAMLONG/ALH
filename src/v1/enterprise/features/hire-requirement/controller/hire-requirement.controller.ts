// Nest dependencies
import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
// Local dependencies
import { Roles } from '@decorators/roles.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ROLE } from '@utils/constants';
import { EnterpriseCreateHireRequirementDto } from '../dto/create-hire-requirement.dto';
import { FilterEnterpriseHireRequirementDto } from '../dto/filter-hire-requirement.dto';
import { EnterpriseHireRequirementService } from '../service/hire-requirement.service';

@ApiTags('[ENTERPRISE] hire requirement')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Controller('enterprise/hire-requirement')
export class EnterpriseHireRequirementController {
  constructor(
    private readonly enterpriseHireRequirementService: EnterpriseHireRequirementService,
  ) {}

  @Roles(ROLE.ENTERPRISE)
  @Post()
  @ApiOperation({ summary: 'Doanh nghiệp tạo yêu cầu thuê' })
  async create(
    @Body() dto: EnterpriseCreateHireRequirementDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.enterpriseHireRequirementService.create(
      user_id,
      dto,
    );
    return result;
  }

  @Roles(ROLE.ENTERPRISE)
  @Get()
  @ApiOperation({ summary: 'Danh sách yêu cầu thuê' })
  async findAll(
    @Query() dto: FilterEnterpriseHireRequirementDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.enterpriseHireRequirementService.findAll(
      user_id,
      dto,
    );
    return result;
  }

  @Roles(ROLE.ENTERPRISE)
  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết yêu cầu thuê' })
  async detail(@Param('id') id: number, @Headers('token') token: any) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.enterpriseHireRequirementService.detail(
      user_id,
      id,
    );
    return result;
  }

  @Roles(ROLE.ENTERPRISE)
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật yêu cầu thuê' })
  async update(
    @Param('id') id: number,
    @Headers('token') token: any,
    @Body() dto: EnterpriseCreateHireRequirementDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.enterpriseHireRequirementService.update(
      id,
      user_id,
      dto,
    );
    return result;
  }
}
