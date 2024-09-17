// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { Banner } from '@models/banner.model';

@Injectable()
export class BannerRepository extends BaseRepository<Banner> {
  constructor() {
    super(Banner);
  }
}
