// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Local dependencies
import { RecruitmentRequirementHro } from '@models/recruitment-requirement-hro.model';
import { Op, Transaction } from 'sequelize';
import { BaseRepository } from './base.repository';

@Injectable()
export class RecruitmentRequirementHroRepository extends BaseRepository<RecruitmentRequirementHro> {
  constructor() {
    super(RecruitmentRequirementHro);
  }

  async bulkCreateHro(id: number, hro_ids: number[], transaction: Transaction) {
    const foundRecruitmentRequirementHroIds = await this.findAll({
      where: {
        recruitment_requirement_id: id,
        user_id: {
          [Op.in]: hro_ids,
        },
      },
    });

    const listIdsCreateFilter: any[] = [];

    if (foundRecruitmentRequirementHroIds) {
      for (const item of foundRecruitmentRequirementHroIds) {
        listIdsCreateFilter.push(item.user_id);
      }
    }

    const result = hro_ids.filter(
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
        'Có lôi xảy ra không thể thêm dữ liệu recruitment_requirement_hro lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async bulkDeleteHro(id: number, hro_ids: number[], transaction: Transaction) {
    const findIdsDelete = await this.findAll({
      where: {
        recruitment_requirement_id: id,
        user_id: {
          [Op.notIn]: hro_ids,
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

        const result = hro_ids.filter(
          (item) => !findUserDeleteIDs.includes(item),
        );

        return result;
      } catch (error) {
        throw new HttpException(
          'Có lôi xảy ra không thể xoá dữ liệu recruitment_requirement_hro lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
