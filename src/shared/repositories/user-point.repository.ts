// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { UserPoint } from '@models/user-point.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserPointRepository extends BaseRepository<UserPoint> {
  constructor() {
    super(UserPoint);
  }
}
