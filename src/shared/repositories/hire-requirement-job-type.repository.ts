// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Local dependencies
import { HireRequirementJobType } from '@models/hire-requirement-job-type.model';
import { Op, Transaction } from 'sequelize';
import { BaseRepository } from './base.repository';

@Injectable()
export class HireRequirementJobTypeRepository extends BaseRepository<HireRequirementJobType> {
  constructor() {
    super(HireRequirementJobType);
  }
  async bulkCreateJobType(
    id: number,
    job_type_ids: number[],
    transaction: Transaction,
  ) {
    const findIdsDelete = await this.findAll({
      where: {
        hire_requirement_id: id,
        job_type_id: {
          [Op.in]: job_type_ids,
        },
      },
    });

    const listIdsCreateFilter: any[] = [];

    if (findIdsDelete) {
      for (const item of findIdsDelete) {
        listIdsCreateFilter.push(item.job_type_id);
      }
    }

    const result = job_type_ids.filter(
      (item) => !listIdsCreateFilter.includes(item),
    );
    const dataCreated = result.map((e) => ({
      hire_requirement_id: id,
      job_type_id: e,
    }));
    try {
      await this.bulkCreate(dataCreated, { transaction });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể thêm dữ liệu hire_requirement_job_type lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async bulkDeleteJobType(
    id: number,
    job_type_ids: number[],
    transaction: Transaction,
  ) {
    const findIdsDelete = await this.findAll({
      where: {
        hire_requirement_id: id,
        job_type_id: {
          [Op.notIn]: job_type_ids,
        },
      },
    });
    if (findIdsDelete) {
      const findJobTypeDeleteIDs = findIdsDelete.map((e) => e.job_type_id);
      try {
        await this.destroy({
          where: {
            hire_requirement_id: id,
            job_type_id: {
              [Op.in]: findJobTypeDeleteIDs,
            },
          },
          transaction,
        });

        const result = job_type_ids.filter(
          (item) => !findJobTypeDeleteIDs.includes(item),
        );

        return result;
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể xoá dữ liệu hire_requirement_jop_type lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
