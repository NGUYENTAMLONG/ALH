// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { InterestListTransaction } from '@models/interest-list-transaction.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class InterestListTransactionRepository extends BaseRepository<InterestListTransaction> {
  constructor() {
    super(InterestListTransaction);
  }
}
