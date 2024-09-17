// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { UserDataFieldSource } from '@models/user-data-field-source.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserDataFieldSourceRepository extends BaseRepository<UserDataFieldSource> {
  constructor() {
    super(UserDataFieldSource);
  }
}
