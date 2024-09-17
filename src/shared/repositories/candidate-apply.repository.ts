// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { CandidateApply } from '@models/candidate-apply.model';

@Injectable()
export class CandidateApplyRepository extends BaseRepository<CandidateApply> {
  constructor() {
    super(CandidateApply);
  }
}
