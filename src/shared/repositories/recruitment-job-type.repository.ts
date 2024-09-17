// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Local files
import { RecruitmentJobType } from '@models/recruitment-job-type.model';
import { createArrayObjectByKey } from '@utils/create-array-object-by-key';
import { Op, Transaction } from 'sequelize';
import { BaseRepository } from './base.repository';

@Injectable()
export class RecruitmentJobTypeRepository extends BaseRepository<RecruitmentJobType> {
  constructor() {
    super(RecruitmentJobType);
  }

  async bulkCreateJobType(
    id: number,
    cvRecruitmentJobType: number[],
    transaction: Transaction,
  ) {
    const findIdsDelete = await this.findAll({
      where: {
        recruitment_requirement_id: id,
        job_type_id: {
          [Op.in]: cvRecruitmentJobType,
        },
      },
    });

    const listIdsCreatFilter: any[] = [];

    if (findIdsDelete) {
      for (const item of findIdsDelete) {
        listIdsCreatFilter.push(item.job_type_id);
      }
    }

    const result = cvRecruitmentJobType.filter(
      (item) => !listIdsCreatFilter.includes(item),
    );

    const listCreateCardTransferVouhcer = createArrayObjectByKey(
      result,
      'job_type_id',
      id,
      'object',
    );

    try {
      await this.bulkCreate(listCreateCardTransferVouhcer, { transaction });
    } catch (error) {
      throw new HttpException(
        'Có lôi xảy ra không thể xoá dữ liệu requirement job type lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async bulkDeleteJobType(
    id: number,
    cvRecruitmentJobType: number[],
    transaction: Transaction,
  ) {
    const findIdsDelete = await this.findAll({
      where: {
        recruitment_requirement_id: id,
        job_type_id: {
          [Op.notIn]: cvRecruitmentJobType,
        },
      },
    });

    const listIdsDelete = createArrayObjectByKey(
      findIdsDelete,
      'job_type_id',
      id,
      'object_value',
    );

    try {
      await this.destroy({
        where: {
          recruitment_requirement_id: id,
          job_type_id: {
            [Op.in]: listIdsDelete,
          },
        },
        transaction,
      });

      const result = cvRecruitmentJobType.filter(
        (item) => !listIdsDelete.includes(item),
      );

      return result;
    } catch (error) {
      throw new HttpException(
        'Có lôi xảy ra không thể xoá dữ liệu requirement job type lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
