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
import { AdminCreateScheduleInterviewDto } from '../dto/create-schedule-interview.dto';
import { AdminFilterScheduleInterviewDto } from '../dto/filter-schedule-interview.dto';
import { AdminUpdateScheduleInterviewDto } from '../dto/update-schedule-interview.dto';
import { AdminScheduleInterviewService } from '../service/schedule-interview.service';

@ApiTags('[ADMIN] schedule interview')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(
  ROLE.ADMIN,
  ROLE.IMPLEMENTATION_SALE,
  ROLE.RESPONSIBLE_SALE,
  ROLE.HRO,
  ROLE.CANDIDATE,
)
@Controller('admin/schedule-interview')
export class AdminScheduleInterviewController {
  constructor(
    private readonly adminScheduleInterviewService: AdminScheduleInterviewService,
  ) {}

  @ApiOperation({
    summary: 'Danh sách lịch hẹn phỏng vấn',
  })
  @ApiResponse({
    description: 'Danh sách lịch hẹn phỏng vấn',
  })
  @Get()
  async findAll(
    @Headers('token') token: any,
    @Query() dto: AdminFilterScheduleInterviewDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.adminScheduleInterviewService.findAll(
      user_id,
      dto,
    );
    return result;
  }

  @ApiOperation({
    summary: 'Tạo mới lịch hẹn phỏng vấn',
  })
  @ApiResponse({
    description: 'Chi tiết lịch hẹn phỏng vấn',
  })
  @Post()
  async create(@Body() dto: AdminCreateScheduleInterviewDto) {
    const result = await this.adminScheduleInterviewService.create(dto);
    return result;
  }

  @ApiOperation({
    summary: 'Cập nhật lịch hẹn phỏng vấn',
  })
  @ApiResponse({
    description: 'Chi tiết lịch hẹn phỏng vấn',
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: AdminUpdateScheduleInterviewDto,
  ) {
    const result = await this.adminScheduleInterviewService.update(id, dto);
    return result;
  }
}
