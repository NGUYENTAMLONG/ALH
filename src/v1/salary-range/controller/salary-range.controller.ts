// Nest dependencies
import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
//Local dependencies
import { SalaryRangeService } from '../service/salary-range.service';

@ApiTags('SALARY RANGE')
@ApiSecurity('token')
@Controller('salary-range')
export class SalaryRangeController {
  constructor(private readonly salaryRangeService: SalaryRangeService) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách mức lương ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về danh sách mức lương trên hệ thống',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thành công',
        data: [
          {
            id: 1,
            min_salary: 1000000,
            max_salary: 2000000,
            description: null,
            created_at: '2023-08-16T09:50:34.000Z',
            updated_at: '2023-08-16T09:50:34.000Z',
            deleted_at: null,
          },
        ],
      },
    },
  })
  findAll() {
    return this.salaryRangeService.findAll();
  }
}
