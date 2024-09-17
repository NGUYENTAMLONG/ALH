// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { ApplicationJobType } from '@models/application-job-type.model';

@Injectable()
export class ApplicationJobTypeRepository extends BaseRepository<ApplicationJobType> {
  constructor() {
    super(ApplicationJobType);
  }
}
