// Nest dependencies
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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
import { AdminFilterTrackingDto } from '../dto/filter-tracking.dto';
import { AdminTrackingService } from '../service/tracking.service';

@ApiTags('[ADMIN] tracking')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ADMIN, ROLE.IMPLEMENTATION_SALE, ROLE.RESPONSIBLE_SALE)
@Controller('admin/tracking')
export class AdminTrackingController {
  constructor(private readonly adminTrackingService: AdminTrackingService) {}

  @Get()
  @ApiOperation({
    summary: 'danh sách tracking',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách tracking',
  })
  async findAll(@Query() dto: AdminFilterTrackingDto) {
    const trackingLogs = await this.adminTrackingService.findAll(dto);
    return trackingLogs;
  }
}
