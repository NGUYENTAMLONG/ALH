// Nest dependencies
import {
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
import { AuthGuard } from '@guards/auth.guard';
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { FilterNotificationDto } from '../dto/filter-notification.dto';
import { DfNotificationService } from '../service/notification.service';

@ApiTags('NOTIFICATION')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: DfNotificationService) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách thông báo',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách thông báo',
  })
  async findAll(
    @Headers('token') token: any,
    @Query() dto: FilterNotificationDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const notifications = await this.notificationService.findAll(user_id, dto);
    return notifications;
  }

  @Patch(':id/read')
  @ApiOperation({
    summary: 'Đọc thông báo',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết thông báo',
  })
  async readNotification(@Param('id') id: number) {
    const result = await this.notificationService.readNotification(id);
    return result;
  }

  @Patch('read-all')
  @ApiOperation({
    summary: 'Đọc tất cả thông báo',
  })
  @ApiResponse({
    status: 200,
    description: 'Đọc tất cả thông báo',
  })
  async readAllNotification(@Headers('token') token: any) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.notificationService.readAllNotification(user_id);
    return result;
  }
}
