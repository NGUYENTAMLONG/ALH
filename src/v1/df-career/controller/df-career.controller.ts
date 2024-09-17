import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { DFCareerService } from '../service/df-career.service';

@ApiTags('DF Career')
@Controller('df-career')
export class DFCareerController {
  constructor(private readonly dFCareerService: DFCareerService) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách nghề nghiệp',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về danh sách nghề nghiệp của hệ thống',
  })
  async findAll() {
    return this.dFCareerService.findAll();
  }
}
