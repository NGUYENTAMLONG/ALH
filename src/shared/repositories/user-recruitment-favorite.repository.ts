// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { BaseRepository } from './base.repository';
import { UserRecruitmentFavorite } from '@models/user-recruitment-favorite.model';

@Injectable()
export class UserRecruitmentFavoriteRepository extends BaseRepository<UserRecruitmentFavorite> {
  constructor() {
    super(UserRecruitmentFavorite);
  }
}
