// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Local dependencies
import { AgeGroup } from '@models/age-group.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class AgeGroupRepository extends BaseRepository<AgeGroup> {
  constructor() {
    super(AgeGroup);
  }

  async findAgeGroup(id: number) {
    try {
      return await this.findByPk(id);
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy thông tin nhóm tuổi lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
