// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { RecruitmentRequirementHistory } from '@models/recruitment-requirement-history.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class RecruitmentRequirementHistoryRepository extends BaseRepository<RecruitmentRequirementHistory> {
  constructor() {
    super(RecruitmentRequirementHistory);
  }
}
