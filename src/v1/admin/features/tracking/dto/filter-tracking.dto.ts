//Nest dependencies
import { IntersectionType } from '@nestjs/swagger';
//Local files
import { PagingDto } from 'src/shared/dto/paging.dto';

export class AdminFilterTrackingDto extends IntersectionType(PagingDto) {}
