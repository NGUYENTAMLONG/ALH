// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { WalletHistory } from '@models/wallet-history.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class WalletHistoryRepository extends BaseRepository<WalletHistory> {
  constructor() {
    super(WalletHistory);
  }
}
