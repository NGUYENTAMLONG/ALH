// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { ConfigApprovalHro } from '@models/config-approval-hro.model';

@Injectable()
export class ConfigApprovalHroRepository extends BaseRepository<ConfigApprovalHro> {
  constructor() {
    super(ConfigApprovalHro);
  }
}
