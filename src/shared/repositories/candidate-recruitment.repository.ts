// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { CandidateRecruitment } from '@models/candidate-recruitment.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class CandidateRecruitmentRepository extends BaseRepository<CandidateRecruitment> {
  constructor() {
    super(CandidateRecruitment);
  }
}
