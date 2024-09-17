// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { Application } from '@models/application.model';

@Injectable()
export class ApplicationRepository extends BaseRepository<Application> {
  constructor() {
    super(Application);
  }
}
