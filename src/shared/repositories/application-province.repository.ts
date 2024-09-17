// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { ApplicationProvince } from '@models/application-province.model';

@Injectable()
export class ApplicationProvinceRepository extends BaseRepository<ApplicationProvince> {
  constructor() {
    super(ApplicationProvince);
  }
}
