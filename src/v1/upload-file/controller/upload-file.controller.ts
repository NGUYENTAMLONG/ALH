// Nest dependencies
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import * as iconv from 'iconv-lite';

// Other dependencies
import { Response } from 'express';
import { join } from 'path';

// Local files
import { Public } from '@decorators/public.decorator';
import { configService } from '@services/config.service';
import { getFullUrl } from '@utils/constants';
import { sendSuccess } from '@utils/send-success';
import { UploadMultipleFilesDto, UploadSingleFileDto } from '../dto/files.dto';

@ApiTags('[File] upload')
@ApiSecurity('token')
@Controller('upload-file')
export class UploadFileController {
  @Public()
  @ApiOperation({ security: [{}], summary: 'Download multiple file' })
  @Get('/download/:url')
  async downloadFile(@Param('url') url: string, @Res() res: Response) {
    try {
      const distPath = join(process.cwd(), url); // Đường dẫn đến thư mục
      const filePath = join(distPath);
      res.download(filePath); // Tải tệp tin về
    } catch (error) {
      throw new HttpException(
        'Đường dẫn tải file có vấn đề vui lòng kiểm tra lại',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  @Public()
  @ApiOperation({ security: [{}], summary: 'Upload multiple file' })
  @UseInterceptors(FileInterceptor('files', configService.getSavFile('files')))
  @ApiConsumes('multipart/form-data')
  @Post('/upload/multiple')
  async uploadMultipleFiles(
    @Req() req: any,
    @Body() uploadMultipleFilesDto: UploadMultipleFilesDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const return_arr: any = [];

    if (files) {
      files.forEach((file) => {
        return_arr.push({
          filename: file.filename,
          url: getFullUrl(file.path),
          path: file.path,
        });
      });
    }

    return sendSuccess({
      data: return_arr,
    });
  }

  @Public()
  @ApiOperation({ security: [{}], summary: 'Upload single file' })
  @UseInterceptors(FileInterceptor('file', configService.getSavFile('files')))
  @ApiConsumes('multipart/form-data')
  @Post('/upload/single')
  async uploadSingleFile(
    @Req() req: any,
    @Body() uploadSingleFileDto: UploadSingleFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const originalname = iconv.decode(
      Buffer.from(file.originalname, 'latin1'),
      'utf8',
    );

    return sendSuccess({
      data: {
        originalname,
        filename: file.filename,
        url: getFullUrl(file.path),
        path: file.path,
      },
    });
  }
}
