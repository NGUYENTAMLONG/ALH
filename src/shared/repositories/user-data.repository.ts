// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { UserData } from '@models/user-data.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserDataRepository extends BaseRepository<UserData> {
  constructor() {
    super(UserData);
  }
}
