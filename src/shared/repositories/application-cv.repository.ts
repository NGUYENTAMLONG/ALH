// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { ApplicationCV } from '@models/application-cv.model';

@Injectable()
export class ApplicationCVRepository extends BaseRepository<ApplicationCV> {
  constructor() {
    super(ApplicationCV);
  }
}
