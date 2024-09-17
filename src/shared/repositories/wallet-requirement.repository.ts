// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { WalletRequirement } from '@models/wallet-requirement.model';

@Injectable()
export class WalletRequirementRepository extends BaseRepository<WalletRequirement> {
  constructor() {
    super(WalletRequirement);
  }
}
