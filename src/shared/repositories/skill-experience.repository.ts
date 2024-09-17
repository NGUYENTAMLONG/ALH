// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { SkillExperience } from '@models/skill-experience.model';

@Injectable()
export class SkillExperienceRepository extends BaseRepository<SkillExperience> {
  constructor() {
    super(SkillExperience);
  }
}
