// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { TrackingLog } from '@models/tracking-log.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class TrackingLogRepository extends BaseRepository<TrackingLog> {
  constructor() {
    super(TrackingLog);
  }
}
