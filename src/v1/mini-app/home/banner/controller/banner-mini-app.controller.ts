import {
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { BannerMiniAppService } from '../service/banner-mini-app.service';
import { FilterBannerDto } from '../dto/banner.dto';

@ApiTags('[HOME] Banner')
@Controller('home/news')
export class BannerMiniAppController {
  constructor(private readonly bannerMiniAppService: BannerMiniAppService) {}

  @Get('banners')
  @ApiOperation({
    summary: 'Danh sách các banner đang active',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về danh sách các banner đang active (không phân trang)',
  })
  async findAll(@Query() dto: FilterBannerDto) {
    return this.bannerMiniAppService.findAllActiveSlides(dto);
  }

  @Get('/banners/:id')
  @ApiOperation({
    summary: 'Chi tiết một banner từ phía mini-app',
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
    return this.bannerMiniAppService.findOne(+id);
  }
}
