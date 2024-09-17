// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { DFDegree } from '@models/df-degree.model';

@Injectable()
export class DFDegreeRepository extends BaseRepository<DFDegree> {
  constructor() {
    super(DFDegree);
  }
}
