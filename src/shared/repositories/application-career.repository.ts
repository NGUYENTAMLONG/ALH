// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { ApplicationCareer } from '@models/application-career.model';

@Injectable()
export class ApplicationCareerRepository extends BaseRepository<ApplicationCareer> {
  constructor() {
    super(ApplicationCareer);
  }
}
