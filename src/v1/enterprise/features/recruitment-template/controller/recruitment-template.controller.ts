// Nest dependencies
import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

// Local files
import { Roles } from '@decorators/roles.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { ROLE } from '@utils/constants';
import { DetailRecruitmentTemplateSchema } from '../schemas/detail-recruitment-template.schema';
import { ListRecruitmentTemplateSchema } from '../schemas/list-recruitment-template.schema';
import { RecruitmentTemplateService } from '../service/recruitment-template.service';

@ApiTags('[ENTERPRISE] recruitment template')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ENTERPRISE)
@Controller('enterprise/recruitment-template')
export class RecruitmentTemplateController {
  constructor(
    private readonly recruitmentTemplateService: RecruitmentTemplateService,
  ) {}

  @ApiOperation({
    summary: 'Danh sách mẫu tuyển dụng',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: ListRecruitmentTemplateSchema,
    },
  })
  @Get()
  findAll() {
    return this.recruitmentTemplateService.findAll();
  }

  @ApiOperation({
    summary: 'Chi tiết mẫu tuyển dụng',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: DetailRecruitmentTemplateSchema,
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recruitmentTemplateService.findOne(+id);
  }
}
