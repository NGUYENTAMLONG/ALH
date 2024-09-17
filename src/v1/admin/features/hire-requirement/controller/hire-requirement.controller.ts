// Nest dependencies
import {
  Body,
  Controller,
  Delete,
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
import { AdminCreateHireRequirementDto } from '../dto/create-hire-requirement.dto';
import { AdminDeleteHireRequirementDto } from '../dto/delete-hire-requirement.dto';
import { AdminFilterHireRequirementDto } from '../dto/filter-hire-requirement.dto';
import { AdminHireRequirementService } from '../service/hire-requirement.service';

@ApiTags('[ADMIN] hire requirement')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Controller('admin/hire-requirement')
export class AdminHireRequirementController {
  constructor(
    private readonly adminHireRequirementService: AdminHireRequirementService,
  ) {}

  @Roles(ROLE.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Admin tạo yêu cầu thuê' })
  async create(
    @Body() dto: AdminCreateHireRequirementDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminHireRequirementService.create(user_id, dto);
    return result;
  }

  @Roles(ROLE.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Danh sách yêu cầu thuê' })
  async findAll(
    @Query() dto: AdminFilterHireRequirementDto,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminHireRequirementService.findAll(user_id, dto);
    return result;
  }

  @Roles(ROLE.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết yêu cầu thuê' })
  async detail(@Param('id') id: number) {
    const result = await this.adminHireRequirementService.detail(id);
    return result;
  }

  @Roles(ROLE.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật yêu cầu thuê' })
  async update(
    @Param('id') id: number,
    @Body() dto: AdminCreateHireRequirementDto,
  ) {
    const result = await this.adminHireRequirementService.update(id, dto);
    return result;
  }

  @Roles(ROLE.ADMIN)
  @Delete()
  @ApiOperation({ summary: 'Xóa yêu cầu thuê' })
  async delete(@Body() dto: AdminDeleteHireRequirementDto) {
    const result = await this.adminHireRequirementService.delete(dto);
    return result;
  }
}
