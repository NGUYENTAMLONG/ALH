// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { ForgotPassword } from '../models/forgot-password.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class ForgotPasswordRepository extends BaseRepository<ForgotPassword> {
  constructor() {
    super(ForgotPassword);
  }
}
