// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { FeeType } from '@models/fee-type.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class FeeTypeRepository extends BaseRepository<FeeType> {
  constructor() {
    super(FeeType);
  }
}
