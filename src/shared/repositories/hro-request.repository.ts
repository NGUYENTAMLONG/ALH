// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { HroRequest } from '@models/hro-request.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class HroRequestRepository extends BaseRepository<HroRequest> {
  constructor() {
    super(HroRequest);
  }
}
