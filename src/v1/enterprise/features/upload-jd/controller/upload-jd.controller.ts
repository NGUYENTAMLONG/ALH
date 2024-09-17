// Nest dependencies
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

// Other dependencies
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

// Local files
import { Roles } from '@decorators/roles.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ROLE } from '@utils/constants';
import { CreateUploadJdDto } from '../dto/create-upload-jd.dto';
import { FilterUploadJdFileDto } from '../dto/filter-upload-jd-file.dto';
import { UploadJdService } from '../service/upload-jd.service';

@ApiTags('[ENTERPRISE] upload jd')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ENTERPRISE)
@Controller('enterprise/upload-jd')
export class UploadJdController {
  constructor(private readonly uploadJdService: UploadJdService) {}

  @ApiOperation({
    summary: 'Chi tiết file jd',
  })
  @Get('file/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thành công',
        data: {
          file: 'http://localhost:3088/public/jd/1692588720.jpg',
          id: 1,
          enterprise_id: 1,
          code: 'YC00001',
          status: 2,
          created_at: '2023-08-21T03:32:01.000Z',
          updated_at: '2023-08-21T03:32:01.000Z',
          deleted_at: null,
        },
        links: {},
        blocks: {
          status: {
            PROCESSED: 1,
            PENDING: 2,
            REJECTED: 3,
            IN_PROGRESS: 4,
          },
        },
      },
    },
  })
  async findOneJdFile(
    @Param('id', new ValidationPipe()) jd_file_id: number,
    @Headers('token') token: any,
  ) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');

    return await this.uploadJdService.findOneJdFile(user_id, jd_file_id);
  }

  @ApiOperation({
    summary: 'Danh sách JD có sẵn',
  })
  @Get('file')
  async findAllJdFile(
    @Query() dto: FilterUploadJdFileDto,
    @Headers('token') token: any,
  ) {
    const id = jwtManipulationService.decodeJwtToken(token, 'id');

    return await this.uploadJdService.findAllJdFile(id, dto);
  }

  @Post('file')
  @ApiOperation({
    summary: 'Upload file JD hoặc upload jd theo mẫy có sẵn',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thành công',
        data: {
          id: 1,
          enterprise_id: 1,
          file: 'http://localhost:3088/public/jd/1692588720.jpg',
          status: 2,
          updated_at: '2023-08-21T03:32:01.032Z',
          created_at: '2023-08-21T03:32:01.032Z',
        },
        links: {
          jd: 'http://localhost:3088/public/jd/1692588720.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    schema: {
      example: {
        status: 0,
        code: 401,
        msg: 'Vui lòng đăng nhập tài khoản doanh nghiệp vào hệ thống',
        data: {},
        timestamp: '2023-08-21T03:23:43.409Z',
        path: '/api/upload-jd/file',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    schema: {
      example: {
        status: 0,
        code: 500,
        msg: 'Có lỗi xảy ra không thể upload file JD lúc này',
        data: {},
        timestamp: '2023-08-21T03:24:43.409Z',
        path: '/api/upload-jd/file',
      },
    },
  })
  async uploadFileJd(
    @Body() dto: CreateUploadJdDto,
    @Headers('token') token: any,
  ) {
    const id = jwtManipulationService.decodeJwtToken(token, 'id');

    const response = await this.uploadJdService.saveJdFile(id, dto);

    return response;
  }
}
