// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { EducationExperience } from '@models/education-experience.model';

@Injectable()
export class EducationExperienceRepository extends BaseRepository<EducationExperience> {
  constructor() {
    super(EducationExperience);
  }
}
