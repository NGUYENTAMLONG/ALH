// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { Wallet } from '@models/wallet.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class WalletRepository extends BaseRepository<Wallet> {
  constructor() {
    super(Wallet);
  }
}
