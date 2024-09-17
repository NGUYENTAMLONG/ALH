// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { RecruitmentRequirementFile } from '@models/recruitment-requirement-file.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class RecruitmentRequirementFileRepository extends BaseRepository<RecruitmentRequirementFile> {
  constructor() {
    super(RecruitmentRequirementFile);
  }
}
