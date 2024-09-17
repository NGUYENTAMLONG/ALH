// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { InterestListJobType } from '@models/interest-list-job-type.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class InterestListJobTypeRepository extends BaseRepository<InterestListJobType> {
  constructor() {
    super(InterestListJobType);
  }
}
