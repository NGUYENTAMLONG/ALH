import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { YearOfExperienceService } from '../service/year-of-experience.service';

@ApiTags('YEAR OF EXPERIENCE')
@ApiSecurity('token')
@Controller('year-of-experience')
export class YearOfExperienceController {
  constructor(
    private readonly yearOfExperienceService: YearOfExperienceService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách số năm kinh nghiệm của hệ thống',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về danh sách số năm kinh nghiệm của hệ thống',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thành công',
        data: [
          {
            id: 1,
            min_years: 0,
            max_years: 0,
            description: 'Chưa có kinh nghiệm',
            created_at: '2023-08-16T09:50:34.000Z',
            updated_at: '2023-08-16T09:50:34.000Z',
            deleted_at: null,
          },
        ],
      },
    },
  })
  async findAll() {
    return this.yearOfExperienceService.findAll();
  }
}
