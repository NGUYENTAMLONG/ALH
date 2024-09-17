// Nest dependencies
import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
// Local files
import { FeeTypeService } from '../service/fee-type.service';

@ApiTags('FEE TYPE')
@ApiSecurity('token')
@Controller('fee_type')
export class FeeTypeController {
  constructor(private readonly feeTypeService: FeeTypeService) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách loại phí',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về danh sách  loại phí đang có trên hệ thống',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thành công',
        data: [
          {
            id: 1,
            name: 'CV',
            price: 500000,
            created_at: '2023-09-28T03:45:02.000Z',
            updated_at: '2023-09-28T03:45:02.000Z',
            deleted_at: null,
          },
        ],
      },
    },
  })
  async findAll() {
    const result = await this.feeTypeService.findAll();
    return result;
  }
}
