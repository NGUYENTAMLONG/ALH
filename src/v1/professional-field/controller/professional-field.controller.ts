// Nest dependencies
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

// Local dependencies
import { Public } from '@decorators/public.decorator';
import { sendSuccess } from '@utils/send-success';
import { ProfessionalFieldService } from '../service/professional-field.service';

@ApiTags('[PROFESSIONAL FIELD]')
@ApiSecurity('token')
@Controller('professional-field')
export class ProfessionalFieldController {
  constructor(
    private readonly professionalFieldService: ProfessionalFieldService,
  ) {}

  @Public()
  @Get(':id')
  @ApiOperation({
    security: [{}],
    summary: 'Chi tiết linh vực chuyên môn',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thành công',
        data: {
          id: 1,
          name: 'Bất động sản',
          description: 'Lĩnh vực đang cần nhân lực vào thời điểm hiện tại',
          created_at: '2023-08-16T09:50:34.000Z',
          updated_at: '2023-08-16T10:22:48.000Z',
          deleted_at: null,
        },
        links: {},
        blocks: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: {
      example: {
        status: 0,
        code: 404,
        msg: 'Thông tin chi tiết lĩnh vực chuyên môn không tồn tại trên hệ thống',
        data: {},
        timestamp: '2023-08-24T20:19:48.985Z',
        path: '/api/professional-field/11212',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    schema: {
      example: {
        status: 0,
        code: 500,
        msg: 'Có lỗi xảy ra không thể lấy dữ liệu chi tiết lĩnh vực chuyên môn lúc này',
        data: {},
        timestamp: '2023-08-24T20:19:48.985Z',
        path: '/api/professional-field/111212',
      },
    },
  })
  async findOne(@Param('id', new ValidationPipe()) id: number) {
    const professionalField =
      await this.professionalFieldService.findProfessionalField(id);

    if (!professionalField) {
      throw new HttpException(
        'Thông tin chi tiết lĩnh vực chuyên môn không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    return sendSuccess({ data: professionalField });
  }

  @Get()
  @ApiOperation({
    summary: 'Danh sách lĩnh vực chuyên môn',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về danh sách lĩnh vực đang có trên hệ thống',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thành công',
        data: [
          {
            id: 1,
            name: 'Junior Developer',
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
    return this.professionalFieldService.findAll();
  }
}
