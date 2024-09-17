// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { HirePrice } from '@models/hire-price.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class HirePriceRepository extends BaseRepository<HirePrice> {
  constructor() {
    super(HirePrice);
  }
}
