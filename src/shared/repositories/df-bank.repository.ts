// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { DFBank } from '@models/df-bank.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class DFBankRepository extends BaseRepository<DFBank> {
  constructor() {
    super(DFBank);
  }
}
