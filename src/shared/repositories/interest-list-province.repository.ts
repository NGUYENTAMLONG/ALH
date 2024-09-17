// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { InterestListProvince } from '@models/interest-list-province.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class InterestListProvinceRepository extends BaseRepository<InterestListProvince> {
  constructor() {
    super(InterestListProvince);
  }
}
