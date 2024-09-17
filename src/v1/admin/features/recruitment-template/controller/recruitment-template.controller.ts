// Nest dependencies
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';

// Local files
import { Roles } from '@decorators/roles.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { configService } from '@services/config.service';
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ROLE } from '@utils/constants';
import { CreateRecruitmentTemplateDto } from '../dto/create-recruitment-template.dto';
import { FilterRecruitmentTemplateDto } from '../dto/filter-recruitment.dto';
import { UpdateRecruitmentTemplateDto } from '../dto/update-recruitment-template.dto';
import { RecruitmentTemplateService } from '../service/recruitment-template.service';

@ApiTags('[ADMIN] recruitment template')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ADMIN)
@Controller('admin/recruitment-template')
export class RecruitmentTemplateController {
  constructor(
    private readonly recruitmentTemplateService: RecruitmentTemplateService,
  ) {}

  @ApiOperation({
    summary: 'Tạo mẫu yêu cầu tuyển dụng',
  })
  @Post('')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo', configService.getSavFile('files')))
  create(
    @Headers('token') token: any,
    @UploadedFile() file: any,
    @Body() dto: CreateRecruitmentTemplateDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');

    return this.recruitmentTemplateService.create(user_id, dto);
  }

  @ApiOperation({
    summary: 'Danh sách mẫu tuyển dụng',
  })
  @Get()
  findAll(@Query() dto: FilterRecruitmentTemplateDto) {
    return this.recruitmentTemplateService.findAll(dto);
  }

  @ApiOperation({
    summary: 'Chi tiết mẫu tuyển dụng',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recruitmentTemplateService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Cập nhật mẫu tuyển dụng',
  })
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo', configService.getSavFile('files')))
  update(
    @Headers('token') token: any,
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: UpdateRecruitmentTemplateDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');

    return this.recruitmentTemplateService.update(user_id, +id, dto);
  }

  @ApiOperation({
    summary: 'Xoá mẫu tuyển dụng',
  })
  @Delete(':id')
  remove(@Headers('token') token: any, @Param('id') id: string) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');

    return this.recruitmentTemplateService.remove(user_id, +id);
  }
}
