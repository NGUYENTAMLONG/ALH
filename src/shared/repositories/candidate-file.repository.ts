// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { CandidateFile } from '@models/candidate-file.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class CandidateFileRepository extends BaseRepository<CandidateFile> {
  constructor() {
    super(CandidateFile);
  }
}
