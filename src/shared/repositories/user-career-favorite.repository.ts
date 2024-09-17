// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { UserCareerFavorite } from '@models/user-career-favorite.model';

@Injectable()
export class UserCareerFavoriteRepository extends BaseRepository<UserCareerFavorite> {
  constructor() {
    super(UserCareerFavorite);
  }
}
