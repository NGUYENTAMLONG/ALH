// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Local dependencies
import { SalaryRange } from '@models/salary-range.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class SalaryRangeRepository extends BaseRepository<SalaryRange> {
  constructor() {
    super(SalaryRange);
  }

  async findSalaryRange(id: number) {
    try {
      return await this.findByPk(id);
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy dữ liệu mức lương lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
