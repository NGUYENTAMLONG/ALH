// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { CandidateInformationFile } from '@models/candidate-information-file.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class CandidateInformationFileRepository extends BaseRepository<CandidateInformationFile> {
  constructor() {
    super(CandidateInformationFile);
  }
}
