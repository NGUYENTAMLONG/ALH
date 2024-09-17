// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { CandidateInformation } from '@models/candidate-information.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class CandidateInformationRepository extends BaseRepository<CandidateInformation> {
  constructor() {
    super(CandidateInformation);
  }
}
