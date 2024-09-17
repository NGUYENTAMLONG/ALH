import { Module } from '@nestjs/common';
import { UploadFileController } from './controller/upload-file.controller';

@Module({
  controllers: [UploadFileController],
})
export class UploadFileModule {}
