// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { EnterpriseDataField } from '@models/enterprise-data-field.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class EnterpriseDataFieldRepository extends BaseRepository<EnterpriseDataField> {
  constructor() {
    super(EnterpriseDataField);
  }
}
