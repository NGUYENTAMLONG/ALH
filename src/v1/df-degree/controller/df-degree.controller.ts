import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DFDegreeService } from '../service/df-degree.service';

@ApiTags('DF Degree')
@Controller('df-degree')
export class DFDegreeController {
  constructor(private readonly dFDegreeService: DFDegreeService) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách bằng cấp',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về danh sách bằng cấp của hệ thống',
  })
  async findAll() {
    return this.dFDegreeService.findAll();
  }
}
