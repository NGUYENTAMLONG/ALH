// Nest dependencies
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
import { CreatePositionDto } from '../dto/create-position.dto';
import { FilterPositionDto } from '../dto/filter-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';
import { AdminPositionService } from '../service/position.service';

@ApiTags('[ADMIN] position')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ADMIN)
@Controller('admin/position')
export class AdminPositionController {
  constructor(private readonly adminPositionService: AdminPositionService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Thêm mới chức vụ từ phía ADMIN',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Thêm mới chức vụ thành công',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Tên chức vụ đã tồn tại trên hệ thống',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Có lỗi xảy ra không thể thêm mới chức vụ vào lúc này',
  })
  create(@Body() dto: CreatePositionDto) {
    return this.adminPositionService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách chức vụ từ phía ADMIN',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách chức vụ thành công',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Có lỗi xảy ra không thể lấy danh sách chức vụ vào lúc này',
  })
  findAll(@Query() dto: FilterPositionDto) {
    return this.adminPositionService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Chi tiết một chức vụ từ phía ADMIN',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về chi tiết chức vụ thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Chức vụ không tồn tại trên hệ thống',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Có lỗi xảy ra không thể xem chi tiết chức vụ vào lúc này',
  })
  findOne(@Param('id') id: string) {
    return this.adminPositionService.findOne(+id);
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Cập nhật thông tin chức vụ từ phía ADMIN',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật thông tin chức vụ thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Chức vụ không tồn tại trên hệ thống',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Có lỗi xảy ra không thể cập nhật chức vụ vào lúc này',
  })
  update(@Param('id') id: string, @Body() dto: UpdatePositionDto) {
    return this.adminPositionService.update(+id, dto);
  }

  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Xoá chức vụ từ phía ADMIN',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xoá chức vụ thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Chức vụ không tồn tại trên hệ thống',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Có lỗi xảy ra không thể xoá chức vụ vào lúc này',
  })
  remove(@Param('id') id: string) {
    return this.adminPositionService.remove(+id);
  }
}
