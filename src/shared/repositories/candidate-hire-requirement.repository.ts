// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { CandidateHireRequirement } from '@models/candidate-hire-requirement.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class CandidateHireRequirementRepository extends BaseRepository<CandidateHireRequirement> {
  constructor() {
    super(CandidateHireRequirement);
  }
}
