// Nest dependencies
import { IntersectionType } from '@nestjs/swagger';
// Local files
import { PagingDto } from 'src/shared/dto/paging.dto';

export class FilterNotificationDto extends IntersectionType(PagingDto) {}
