// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { CVUploaded } from '@models/cv-uploaded.model';

@Injectable()
export class CVUploadedRepository extends BaseRepository<CVUploaded> {
  constructor() {
    super(CVUploaded);
  }
}
