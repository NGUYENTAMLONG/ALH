// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Local dependencies
import { RecruitmentRequirementImplementation } from '@models/recruitment-requirement-implementation.model';
import { Op, Transaction } from 'sequelize';
import { BaseRepository } from './base.repository';

@Injectable()
export class RecruitmentRequirementImplementationRepository extends BaseRepository<RecruitmentRequirementImplementation> {
  constructor() {
    super(RecruitmentRequirementImplementation);
  }

  async bulkCreateImplementation(
    id: number,
    implementation_ids: number[],
    transaction: Transaction,
  ) {
    const findIdsDelete = await this.findAll({
      where: {
        recruitment_requirement_id: id,
        user_id: {
          [Op.in]: implementation_ids,
        },
      },
    });

    const listIdsCreateFilter: any[] = [];

    if (findIdsDelete) {
      for (const item of findIdsDelete) {
        listIdsCreateFilter.push(item.user_id);
      }
    }

    const result = implementation_ids.filter(
      (item) => !listIdsCreateFilter.includes(item),
    );
    const dataCreated = result.map((e) => ({
      recruitment_requirement_id: id,
      user_id: e,
    }));
    try {
      await this.bulkCreate(dataCreated, { transaction });
      return dataCreated;
    } catch (error) {
      throw new HttpException(
        'Có lôi xảy ra không thể thêm dữ liệu recruitment_requirement_implementation lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async bulkDeleteImplementation(
    id: number,
    implementation_ids: number[],
    transaction: Transaction,
  ) {
    const findIdsDelete = await this.findAll({
      where: {
        recruitment_requirement_id: id,
        user_id: {
          [Op.notIn]: implementation_ids,
        },
      },
    });
    if (findIdsDelete) {
      const findUserDeleteIDs = findIdsDelete.map((e) => e.user_id);
      try {
        await this.destroy({
          where: {
            recruitment_requirement_id: id,
            user_id: {
              [Op.in]: findUserDeleteIDs,
            },
          },
          transaction,
        });

        const result = implementation_ids.filter(
          (item) => !findUserDeleteIDs.includes(item),
        );

        return result;
      } catch (error) {
        throw new HttpException(
          'Có lôi xảy ra không thể xoá dữ liệu recruitment_requirement_implementation lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
