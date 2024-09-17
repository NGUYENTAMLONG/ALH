// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { DFDistrict } from '@models/df-district.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class DFDistrictRepository extends BaseRepository<DFDistrict> {
  constructor() {
    super(DFDistrict);
  }
}
