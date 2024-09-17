// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { CandidateInterestCareer } from '@models/candidate-interest-career.model';

@Injectable()
export class CandidateInterestCareerRepository extends BaseRepository<CandidateInterestCareer> {
  constructor() {
    super(CandidateInterestCareer);
  }
}
