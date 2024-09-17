// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { CandidateApplyFile } from '@models/candidate-apply-file.model';

@Injectable()
export class CandidateApplyFileRepository extends BaseRepository<CandidateApplyFile> {
  constructor() {
    super(CandidateApplyFile);
  }
}
