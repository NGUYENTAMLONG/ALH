//Nest dependencies
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
//Local files
import { Public } from '@decorators/public.decorator';
import { PositionService } from './../service/position.service';
@Public()
@ApiTags('[POSITION]')
@Controller('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @ApiOperation({
    summary: 'Danh sách vị trí',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về danh sách vị trí đang có trên hệ thống',
  })
  @Get()
  async findAll() {
    const position = await this.positionService.findAll();
    return position;
  }

  @ApiOperation({
    summary: 'Danh sách chuyên môn lĩnh vực (tạo tin tuyển dụng mini-app)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về danh sách chuyên môn lĩnh vực đang có trên hệ thống',
  })
  @Get('professionals')
  async findAllProfessionals() {
    const position = await this.positionService.findAllProfessionals();
    return position;
  }
}
