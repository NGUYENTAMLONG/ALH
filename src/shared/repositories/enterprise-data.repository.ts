// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { EnterpriseData } from '@models/enterprise-data.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class EnterpriseDataRepository extends BaseRepository<EnterpriseData> {
  constructor() {
    super(EnterpriseData);
  }
}
