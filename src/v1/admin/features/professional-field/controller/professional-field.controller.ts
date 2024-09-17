// Nest dependencies
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
import { CreateProfessionalFieldDto } from '../dto/create-professional-field.dto';
import { FilterProfessionalField } from '../dto/filter-professional-field.dto';
import { UpdateProfessionalFieldDto } from '../dto/update-professional-field.dto';
import { AdminProfessionalFieldService } from '../service/professional-field.service';

@ApiTags('[ADMIN] profession field')
@ApiSecurity('token')
@UseGuards(AuthGuard)
@Roles(ROLE.ADMIN, ROLE.IMPLEMENTATION_SALE, ROLE.RESPONSIBLE_SALE)
@Controller('admin/professional-field')
export class AdminProfessionalFieldController {
  constructor(
    private readonly professionalFieldService: AdminProfessionalFieldService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo mới lĩnh vực chuyên môn',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo mới lĩnh vực chuyên môn thành công',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thêm mới lĩnh vực thành công',
        data: {
          id: 1,
          name: 'Junior Developer',
          description: null,
          updated_at: '2023-08-16T09:50:34.321Z',
          created_at: '2023-08-16T09:50:34.321Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Lĩnh vực chuyên môn đã tồn tại trên hệ thống',
    schema: {
      example: {
        status: 0,
        code: 302,
        msg: 'Lĩnh vực đã tồn tại trên hệ thống',
        data: {},
        timestamp: '2023-08-16T09:51:05.682Z',
        path: '/api/professional-field',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Có lỗi xảy ra không thể tạo lĩnh vực chuyên môn vào lúc này',
    schema: {
      example: {
        status: 0,
        code: 500,
        msg: 'Có lỗi xảy ra không thể tạo lĩnh vực chuyên môn vào lúc này',
        data: {},
        timestamp: '2023-08-16T09:51:05.682Z',
        path: '/api/professional-field',
      },
    },
  })
  create(@Body() dto: CreateProfessionalFieldDto) {
    return this.professionalFieldService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Danh sách lĩnh vực chuyên mồn',
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
        paging: {
          total_count: 1,
          current_page: 1,
          limit: '12',
          offset: 0,
        },
      },
    },
  })
  findAll(@Query() dto: FilterProfessionalField) {
    return this.professionalFieldService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Thông tin chi tiết lĩnh vực chuyên môn',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về chi tiết lĩnh vực chuyên môn',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Thành công',
        data: {
          id: 1,
          name: 'Junior Developer',
          description: null,
          created_at: '2023-08-16T09:50:34.000Z',
          updated_at: '2023-08-16T09:50:34.000Z',
          deleted_at: null,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Lĩnh vực chuyên môn không tồn tại trên hệ thống',
    schema: {
      example: {
        status: 0,
        code: 404,
        msg: 'Lĩnh vực chuyên môn không tồn tại trên hệ thống',
        data: {},
        timestamp: '2023-08-16T10:11:28.463Z',
        path: '/api/professional-field/2',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Có lỗi xảy ra không thể lấy thông tin chi tiết lĩnh vực',
    schema: {
      example: {
        status: 0,
        code: 500,
        msg: 'Có lỗi xảy ra không thể lấy thông tin chi tiết lĩnh vực',
        data: {},
        timestamp: '2023-08-16T10:11:28.463Z',
        path: '/api/professional-field/2',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.professionalFieldService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật thông tin chi tiết lĩnh vực chuyên môn',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật lĩnh vực chuyên môn thành công',
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Cập nhật thông tin chi tiết lĩnh vực thành công',
        data: {
          id: 1,
          name: 'CEO',
          description: 'Lĩnh vực đang cần nhân lực vào thời điểm hiện tại',
          created_at: '2023-08-16T09:50:34.000Z',
          updated_at: '2023-08-16T10:18:18.300Z',
          deleted_at: null,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Lĩnh vực chuyên môn không tồn tại trên hệ thống',
    schema: {
      example: {
        status: 0,
        code: 404,
        msg: 'Lĩnh vực chuyên môn không tồn tại trên hệ thống',
        data: {},
        timestamp: '2023-08-16T10:18:37.391Z',
        path: '/api/professional-field/2',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Có lỗi xảy ra không thể lấy thông tin chi tiết lĩnh vực',
    schema: {
      example: {
        status: 0,
        code: 500,
        msg: 'Có lỗi xảy ra không thể cập nhật thông tin lĩnh vực lúc này',
        data: {},
        timestamp: '2023-08-16T10:18:37.391Z',
        path: '/api/professional-field/2',
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateProfessionalFieldDto: UpdateProfessionalFieldDto,
  ) {
    return this.professionalFieldService.update(
      +id,
      updateProfessionalFieldDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xoá lĩnh vực chuyên môn',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        status: 1,
        code: 200,
        msg: 'Xoá lĩnh vực thành công',
        data: {
          id: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: {
      example: {
        status: 0,
        code: 404,
        msg: 'Lĩnh vực chuyên môn không tồn tại trên hệ thống',
        data: {},
        timestamp: '2023-08-16T10:21:50.352Z',
        path: '/api/professional-field/2',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    schema: {
      example: {
        status: 0,
        code: 500,
        msg: 'Có lỗi xảy ra không thể xoá thông tin lĩnh vực lúc này',
        data: {},
        timestamp: '2023-08-16T10:21:50.352Z',
        path: '/api/professional-field/2',
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.professionalFieldService.remove(+id);
  }
}
