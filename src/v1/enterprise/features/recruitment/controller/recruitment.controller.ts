// Nest dependencies
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

// Local files
import { Roles } from '@decorators/roles.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { configService } from '@services/config.service';
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ROLE } from '@utils/constants';
import { CreateRecruitmentDto } from '../dto/create-recruitment.dto';
import { FilterRecruitmentDto } from '../dto/filter-recruitment.dto';
import { CreateRecruitmentSchema } from '../schemas/create-recruitment.schema';
import { DetailRecruitmentSchema } from '../schemas/detail-recruitment.schema';
import { RecruitmentService } from '../service/recruitment.service';

@ApiTags('[ENTERPRISE] recruitment')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ENTERPRISE)
@Controller('enterprise/recruitment')
@UseGuards(AuthGuard)
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @ApiOperation({
    summary: 'Cập nhật yêu cầu tuyển dụng',
  })
  @Patch('update/:id')
  @Roles(ROLE.ENTERPRISE)
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      example: CreateRecruitmentSchema,
    },
  })
  @UseInterceptors(FileInterceptor('logo', configService.getSavFile('files')))
  async update(
    @Headers('token') token: any,
    @Param('id') id: number,
    @Body(new ValidationPipe()) dto: CreateRecruitmentDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');

    return await this.recruitmentService.update(user_id, +id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Danh sách yêu cầu tuyển dụng',
  })
  async findAll(
    @Query() dto: FilterRecruitmentDto,
    @Headers('token') token: any,
  ) {
    const id = jwtManipulationService.decodeJwtToken(token, 'id');
    return await this.recruitmentService.findAll(id, dto);
  }

  @Get('count')
  @ApiOperation({
    summary: 'Lấy số lượng các loại yêu cầu tuyển dụng',
  })
  async getCountRecruitment(
    @Query() dto: FilterRecruitmentDto,
    @Headers('token') token: any,
  ) {
    const id = jwtManipulationService.decodeJwtToken(token, 'id');
    return await this.recruitmentService.countRecruitment(id, dto);
  }

  @ApiOperation({ summary: 'Chi tiết yêu cầu tuyển dụng' })
  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: DetailRecruitmentSchema,
    },
  })
  async findOne(@Param('id', new ValidationPipe()) id: number) {
    return await this.recruitmentService.findOne(id);
  }

  @ApiOperation({
    summary: 'Tạo yêu cầu tuyển dụng',
  })
  @Post('create')
  @Roles(ROLE.ENTERPRISE)
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      example: CreateRecruitmentSchema,
    },
  })
  async create(
    @Headers('token') token: any,
    @Body(new ValidationPipe()) dto: CreateRecruitmentDto,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');

    return await this.recruitmentService.create(user_id, dto);
  }
}
