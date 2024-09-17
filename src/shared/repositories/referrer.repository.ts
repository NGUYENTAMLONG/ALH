// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { Referrer } from '@models/referrer.model';

@Injectable()
export class ReferrerRepository extends BaseRepository<Referrer> {
  constructor() {
    super(Referrer);
  }
}
