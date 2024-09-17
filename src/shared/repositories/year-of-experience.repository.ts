// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Local dependencies
import { YearOfExperience } from '@models/year-of-experience.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class YearOfExperienceRepository extends BaseRepository<YearOfExperience> {
  constructor() {
    super(YearOfExperience);
  }

  async findYearOfExperience(id: number) {
    try {
      return await this.findByPk(id);
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy thông tin kinh nghiệm làm việc lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
