// Nest dependencies
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { RECRUITMENT_STATUS } from '@utils/constants';
import { Type } from 'class-transformer';

// Other dependencies
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  IsNumber,
} from 'class-validator';
import { PagingDto } from 'src/shared/dto/paging.dto';

class FormJdUpload {
  @ApiProperty({
    required: true,
    description: 'file',
    example: 'https://dev.api.alehub.net/public/files/171829311034568279.xlsx',
  })
  @IsString()
  @IsNotEmpty()
  file: string;

  @ApiProperty({
    required: true,
    description: 'file_name',
    example: '171829311034568279.xlsx',
  })
  @IsString()
  @IsNotEmpty()
  file_name: string;
}

export class ApplyRecruitmentDto {
  @ApiProperty({
    required: true,
    description: 'Id tin tuyển dụng',
    example: '1',
  })
  @IsNotEmpty({ message: 'Id tin tuyển dụng là bắt buộc' })
  recruitment_requirement_id: number;

  @ApiProperty({
    required: true,
    description: 'Id thông tin ứng viên',
    example: '1',
  })
  @IsNotEmpty({ message: 'Id thông tin ứng viên là bắt buộc' })
  candidate_information_id: number;

  @ApiProperty({
    required: true,
  })
  @IsArray({ message: 'Vui lòng nhập một mảng' })
  @ValidateNested()
  @Type(() => FormJdUpload)
  @IsOptional()
  cv_files: FormJdUpload[];

  @ApiProperty({
    required: true,
    description: 'Tải lên từ máy',
    example: '1',
  })
  @IsOptional()
  upload_from_device: number;

  @ApiProperty({
    required: true,
    description: 'Tải lên từ máy từ trước đó',
    example: '1',
  })
  @IsOptional()
  uploaded_before: number; //File đã được tải lên từ trước đó
}
