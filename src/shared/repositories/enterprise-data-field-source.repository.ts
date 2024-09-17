// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { EnterpriseDataFieldSource } from '@models/enterprise-data-field-source.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class EnterpriseDataFieldSourceRepository extends BaseRepository<EnterpriseDataFieldSource> {
  constructor() {
    super(EnterpriseDataFieldSource);
  }
}
