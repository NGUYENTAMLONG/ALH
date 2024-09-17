// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { UserDataField } from '@models/user-data-field.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserDataFieldRepository extends BaseRepository<UserDataField> {
  constructor() {
    super(UserDataField);
  }
}
