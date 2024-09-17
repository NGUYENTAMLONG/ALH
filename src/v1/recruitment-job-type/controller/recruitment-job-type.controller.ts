import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { sendSuccess } from '@utils/send-success';
import { RecruitmentJobTypeService } from '../service/recruitment-job-type.service';

@ApiTags('[RECRUITMENT JOB TYPE]')
@ApiSecurity('token')
@Controller('recruitment-job-type')
export class RecruitmentJobTypeController {
  constructor(
    private readonly recruitmentJobTypeService: RecruitmentJobTypeService,
  ) {}

  @ApiOperation({
    security: [{}],
    summary:
      'Chi tiết hình thức làm việc của yêu cầu tuyển dụng của doanh nghiệp',
  })
  @Get(':id')
  async findOne(@Param('id', new ValidationPipe()) id: number) {
    const recruitmentJobType =
      await this.recruitmentJobTypeService.findRecruitmentJobType(id);

    if (!recruitmentJobType) {
      throw new HttpException(
        'Chi tiết hình thức làm việc theo yêu của tuyển dụng của doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    return sendSuccess({ data: recruitmentJobType });
  }
}
