// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { CandidateImage } from '@models/candidate-image.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class CandidateImageRepository extends BaseRepository<CandidateImage> {
  constructor() {
    super(CandidateImage);
  }
}
