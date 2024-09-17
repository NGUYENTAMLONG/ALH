import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { DFBankService } from '../service/df-bank.service';

@ApiTags('DF Bank')
@ApiSecurity('token')
@Controller('df-bank')
export class DFBankController {
  constructor(private readonly dFBankService: DFBankService) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách ngân hàng',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về danh sách ngân hàng của hệ thống',
  })
  async findAll() {
    return this.dFBankService.findAll();
  }
}
