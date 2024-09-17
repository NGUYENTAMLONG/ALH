// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { BaseRepository } from './base.repository';
import { DFGroupCareer } from '@models/df-group-career.model';

@Injectable()
export class DFGroupCareerRepository extends BaseRepository<DFGroupCareer> {
  constructor() {
    super(DFGroupCareer);
  }
}
