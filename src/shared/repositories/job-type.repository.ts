// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Local dependencies
import { JobType } from '@models/job-type.model';
import { Op } from 'sequelize';
import { BaseRepository } from './base.repository';

@Injectable()
export class JobTypeRepository extends BaseRepository<JobType> {
  constructor() {
    super(JobType);
  }

  async foundJobType(ids: number[]) {
    try {
      return await this.findAll({
        where: {
          id: { [Op.in]: ids },
        },
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy được sanh sách hình thức làm việc lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
