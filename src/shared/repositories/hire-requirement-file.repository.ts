// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { HireRequirementFile } from '@models/hire-requirement-file.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class HireRequirementFileRepository extends BaseRepository<HireRequirementFile> {
  constructor() {
    super(HireRequirementFile);
  }
}
