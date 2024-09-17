import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateConfigApprovalHroDto } from '../dto/update-config-approval-hro.dto';
import { AdminConfigApprovalHroService } from '../service/config-approval-hro.service';

@ApiTags('[ADMIN] Config Approval HRO')
@ApiSecurity('token')
@Controller('admin/config-approval-hro')
export class AdminConfigPointHroController {
  constructor(
    private readonly adminConfigApprovalHroService: AdminConfigApprovalHroService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Cấu hình tự động duyệt tài khoản HRO của hệ thống',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Trả về danh sách cấu hình động duyệt tài khoản HRO của hệ thống',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thành công',
        data: [
          {
            id: 1,
            auto_approval: 1,
            created_at: '2023-08-16T09:50:34.000Z',
            updated_at: '2023-08-16T09:50:34.000Z',
            deleted_at: null,
          },
        ],
      },
    },
  })
  async findAll() {
    return this.adminConfigApprovalHroService.findAll();
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật cấu hình điểm của hệ thống',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật cấu hình điểm thành công',
  })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateConfigApprovalHroDto,
  ) {
    return this.adminConfigApprovalHroService.update(id, dto);
  }
}
