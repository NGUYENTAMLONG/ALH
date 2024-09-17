// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BankAccount } from '@models/bank-account.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class BankAccountRepository extends BaseRepository<BankAccount> {
  constructor() {
    super(BankAccount);
  }
}
