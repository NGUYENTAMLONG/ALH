// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { FeeOfRecruitmentRequirement } from '@models/fee-of-recruitment-requirement.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class FeeOfRecruitmentRequirementRepository extends BaseRepository<FeeOfRecruitmentRequirement> {
  constructor() {
    super(FeeOfRecruitmentRequirement);
  }
}
