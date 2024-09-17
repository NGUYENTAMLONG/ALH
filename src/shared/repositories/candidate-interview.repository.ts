// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { CandidateInterview } from '@models/candidate-interview.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class CandidateInterviewRepository extends BaseRepository<CandidateInterview> {
  constructor() {
    super(CandidateInterview);
  }
}
