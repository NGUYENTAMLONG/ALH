//Nest dependencies
import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
//Local dependencies
import { JobTypeService } from '../service/job-type.service';

@ApiTags('JOB TYPE')
@ApiSecurity('token')
@Controller('job-type')
export class JobTypeController {
  constructor(private readonly jobTypeService: JobTypeService) {}
  @Get()
  @ApiOperation({
    summary: 'Danh sách loại công việc',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về danh sách loại công việc đang có trên hệ thống',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thành công',
        data: [
          {
            id: 1,
            job_type_time_id: 1,
            job_type_workplace_id: 1,
            name: 'Fulltime Online',
            created_at: '2023-08-16T09:50:34.000Z',
            updated_at: '2023-08-16T09:50:34.000Z',
            deleted_at: null,
          },
        ],
      },
    },
  })
  findAll() {
    return this.jobTypeService.findAll();
  }
}
