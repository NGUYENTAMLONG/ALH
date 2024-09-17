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
import { AdminCreateUserDataFieldDto } from '../dto/create-user-data-field.dto';
import { AdminFilterUserDataFieldDto } from '../dto/filter-user-data-field.dto';
import { AdminUpdateUserDataFieldDto } from '../dto/update-user-data-field.dto';
import { AdminUserDataFieldService } from '../service/user-data-field.service';

@ApiTags('[ADMIN] user data field')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ADMIN)
@Controller('admin/user-data-field')
export class AdminUserDataFieldController {
  constructor(
    private readonly adminUserDataFieldService: AdminUserDataFieldService,
  ) {}

  @ApiOperation({
    summary: 'Thêm mới thuộc tính',
  })
  @ApiResponse({
    description: 'Thêm mới thuộc tính thành công',
  })
  @Post()
  async create(@Body() dto: AdminCreateUserDataFieldDto) {
    const result = await this.adminUserDataFieldService.create(dto);
    return result;
  }

  @ApiOperation({
    summary: 'Danh sách thuộc tính',
  })
  @ApiResponse({
    description: 'Trả về danh sách thuộc tính',
  })
  @Get()
  async findAll(@Query() dto: AdminFilterUserDataFieldDto) {
    const result = await this.adminUserDataFieldService.findAll(dto);
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
    const result = await this.adminUserDataFieldService.detail(id);
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
    @Body() dto: AdminUpdateUserDataFieldDto,
  ) {
    const result = await this.adminUserDataFieldService.update(id, dto);
    return result;
  }

  @ApiOperation({
    summary: 'Xóa thuộc tính',
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const result = await this.adminUserDataFieldService.delete(id);
    return result;
  }
}
