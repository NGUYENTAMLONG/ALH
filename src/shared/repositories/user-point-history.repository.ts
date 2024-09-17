// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { UserPointHistory } from '@models/user-point-history.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserPointHistoryRepository extends BaseRepository<UserPointHistory> {
  constructor() {
    super(UserPointHistory);
  }
}
