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
import { UpdateConfigPointHroDto } from '../dto/update-config-point-hro.dto';
import { AdminConfigPointHroService } from '../service/config-point-hro.service';

@ApiTags('[ADMIN] Config Point HRO')
@ApiSecurity('token')
@Controller('admin/config-point-hro')
export class AdminConfigPointHroController {
  constructor(
    private readonly adminConfigPointHroService: AdminConfigPointHroService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách cấu hình điểm của hệ thống',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về danh sách cấu hình điểm của hệ thống',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thành công',
        data: [
          {
            id: 1,
            point: 0,
            created_at: '2023-08-16T09:50:34.000Z',
            updated_at: '2023-08-16T09:50:34.000Z',
            deleted_at: null,
          },
        ],
      },
    },
  })
  async findAll() {
    return this.adminConfigPointHroService.findAll();
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật cấu hình điểm của hệ thống',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật cấu hình điểm thành công',
  })
  async update(@Param('id') id: number, @Body() dto: UpdateConfigPointHroDto) {
    return this.adminConfigPointHroService.update(id, dto);
  }
}
