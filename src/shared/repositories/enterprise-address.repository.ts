// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { EnterpriseAddress } from '@models/enterprise-address.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class EnterPriseAddressRepository extends BaseRepository<EnterpriseAddress> {
  constructor() {
    super(EnterpriseAddress);
  }
}
