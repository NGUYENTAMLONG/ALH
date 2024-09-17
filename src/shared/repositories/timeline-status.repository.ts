// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { TimelineStatus } from '@models/timeline-status.model';

@Injectable()
export class TimelineStatusRepository extends BaseRepository<TimelineStatus> {
  constructor() {
    super(TimelineStatus);
  }
}
