// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { InterestList } from '@models/interest-list.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class InterestListRepository extends BaseRepository<InterestList> {
  constructor() {
    super(InterestList);
  }
}
