import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AgeGroupService } from '../service/age-group.service';

@ApiTags('AGE GROUP')
@Controller('age-group')
export class AgeGroupController {
  constructor(private readonly ageGroupService: AgeGroupService) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách nhóm tuổi',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về danh sách nhóm tuổi đang có trên hệ thống',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thành công',
        data: [
          {
            id: 1,
            min_age: 18,
            max_age: 22,
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
    return this.ageGroupService.findAll();
  }
}
