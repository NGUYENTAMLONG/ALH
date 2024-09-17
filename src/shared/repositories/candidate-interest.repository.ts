// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { CandidateInterest } from '@models/candidate-interest.model';

@Injectable()
export class CandidateInterestRepository extends BaseRepository<CandidateInterest> {
  constructor() {
    super(CandidateInterest);
  }
}
