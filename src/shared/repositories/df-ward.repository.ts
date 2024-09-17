// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { DFWard } from '@models/df-ward.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class DFWardRepository extends BaseRepository<DFWard> {
  constructor() {
    super(DFWard);
  }
}
