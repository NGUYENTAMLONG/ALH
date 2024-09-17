// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { DFCareer } from '@models/df-career.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class DFCareerRepository extends BaseRepository<DFCareer> {
  constructor() {
    super(DFCareer);
  }
}
