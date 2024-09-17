import { ApiProperty } from '@nestjs/swagger';

export class UploadSingleFileDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: Express.Multer.File;
}

export class UploadMultipleFilesDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
  })
  files: Express.Multer.File[];
}
