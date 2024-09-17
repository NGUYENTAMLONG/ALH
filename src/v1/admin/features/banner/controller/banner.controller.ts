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
import {
  CreateBannerDto,
  FilterBannerDto,
  UpdateBannerDto,
  UpdateBannerStatusDto,
} from '../dto/banner.dto';
import { AdminBannerService } from '../service/banner.service';

@ApiTags('[ADMIN] Banner')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ADMIN)
@Controller('admin/banner')
export class AdminBannerController {
  constructor(private readonly bannerService: AdminBannerService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Thêm mới Banner từ phía ADMIN',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Thêm mới Banner thành công',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Banner đã tồn tại trên hệ thống',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Có lỗi xảy ra không thể thêm mới banner vào lúc này',
  })
  create(@Body() dto: CreateBannerDto) {
    return this.bannerService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách banner từ phía ADMIN',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách banner thành công',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Có lỗi xảy ra không thể lấy danh sách banner vào lúc này',
  })
  findAll(@Query() dto: FilterBannerDto) {
    return this.bannerService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Chi tiết một banner từ phía ADMIN',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về chi tiết banner thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Banner không tồn tại trên hệ thống',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Có lỗi xảy ra không thể xem chi tiết banner vào lúc này',
  })
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(+id);
  }

  @Patch('update')
  @ApiOperation({
    summary: 'Cập nhật thông tin banner từ phía ADMIN',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật thông tin banner thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Chức vụ không tồn tại trên hệ thống',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Có lỗi xảy ra không thể cập nhật banner vào lúc này',
  })
  update(@Body() dto: UpdateBannerDto) {
    return this.bannerService.update(dto);
  }

  @Patch('update-status')
  @ApiOperation({
    summary: 'Cập nhật trạng thái banner từ phía ADMIN',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật trạng thái banner thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Chức vụ không tồn tại trên hệ thống',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description:
      'Có lỗi xảy ra không thể cập nhật trạng thái banner vào lúc này',
  })
  updateStatus(@Body() dto: UpdateBannerStatusDto) {
    return this.bannerService.updateStatus(dto);
  }

  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Xoá banner từ phía ADMIN',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xoá banner thành công',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Banner không tồn tại trên hệ thống',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Có lỗi xảy ra không thể xoá banner vào lúc này',
  })
  remove(@Param('id') id: string) {
    return this.bannerService.remove(+id);
  }
}
