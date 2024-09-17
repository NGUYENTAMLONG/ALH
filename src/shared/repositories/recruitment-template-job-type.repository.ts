// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Other dependencies
import { Transaction } from 'sequelize';

// Local files
import { RecruitmentJobType } from '@models/recruitment-job-type.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class RecruitmentTemplateJobTypeRepository extends BaseRepository<RecruitmentJobType> {
  constructor() {
    super(RecruitmentJobType);
  }

  async destroyRecTemplateJobType(
    recruitment_requirement_id: number,
    transaction: Transaction,
  ) {
    try {
      await this.destroy({
        where: {
          recruitment_requirement_id,
        },
        transaction,
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể xoá Loại công việc của mẫu tuyển dụng lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
