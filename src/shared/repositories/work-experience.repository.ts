// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { WorkExperience } from '@models/work-experience.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class WorkExperienceRepository extends BaseRepository<WorkExperience> {
  constructor() {
    super(WorkExperience);
  }
}
