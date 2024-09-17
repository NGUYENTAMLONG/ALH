//Nest dependencies
import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
//Local dependencies
import { GenderService } from '../service/gender.service';

@ApiTags('GENDER')
@ApiSecurity('token')
@Controller('gender')
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách giới tính',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về danh sách  giới tính đang có trên hệ thống',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thành công',
        data: [
          {
            id: 1,
            name: 'Nam',
            created_at: '2023-08-16T09:50:34.000Z',
            updated_at: '2023-08-16T09:50:34.000Z',
            deleted_at: null,
          },
        ],
      },
    },
  })
  findAll() {
    return this.genderService.findAll();
  }
}
