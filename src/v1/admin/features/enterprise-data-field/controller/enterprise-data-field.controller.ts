// Nest dependencies
import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ROLE } from '@utils/constants';
import { AdminCreateEnterpriseDataFieldDto } from '../dto/create-enterprise-data-field.dto';
import { AdminFilterEnterpriseDataFieldDto } from '../dto/filter-enterprise-data-field.dto';
import { AdminUpdateEnterpriseDataFieldDto } from '../dto/update-enterprise-data-field.dto';
import { AdminEnterpriseDataFieldService } from '../service/enterprise-data-field.service';

@ApiTags('[ADMIN] enterprise data field')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ADMIN)
@Controller('admin/enterprise-data-field')
export class AdminEnterpriseDataFieldController {
  constructor(
    private readonly adminEnterpriseDataFieldService: AdminEnterpriseDataFieldService,
  ) {}

  @ApiOperation({
    summary: 'Thêm mới thuộc tính',
  })
  @ApiResponse({
    description: 'Thêm mới thuộc tính thành công',
  })
  @Post()
  async create(@Body() dto: AdminCreateEnterpriseDataFieldDto) {
    const result = await this.adminEnterpriseDataFieldService.create(dto);
    return result;
  }

  @ApiOperation({
    summary: 'Danh sách thuộc tính',
  })
  @ApiResponse({
    description: 'Trả về danh sách thuộc tính',
  })
  @Get()
  async findAll(@Query() dto: AdminFilterEnterpriseDataFieldDto) {
    const result = await this.adminEnterpriseDataFieldService.findAll(dto);
    return result;
  }

  @ApiOperation({
    summary: 'Chi tiết thuộc tính',
  })
  @ApiResponse({
    description: 'Trả về chi tiết thuộc tính',
  })
  @Get(':id')
  async detail(@Param('id') id: number) {
    const result = await this.adminEnterpriseDataFieldService.detail(id);
    return result;
  }

  @ApiOperation({
    summary: 'Cập nhật thuộc tính',
  })
  @ApiResponse({
    description: 'Trả về chi tiết thuộc tính',
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: AdminUpdateEnterpriseDataFieldDto,
  ) {
    const result = await this.adminEnterpriseDataFieldService.update(id, dto);
    return result;
  }

  @ApiOperation({
    summary: 'Xóa thuộc tính',
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const result = await this.adminEnterpriseDataFieldService.delete(id);
    return result;
  }
}
