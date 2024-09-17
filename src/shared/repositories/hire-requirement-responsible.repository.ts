// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Local dependencies
import { HireRequirementResponsible } from '@models/hire-requirement-responsible.model';
import { Op, Transaction } from 'sequelize';
import { BaseRepository } from './base.repository';

@Injectable()
export class HireRequirementResponsibleRepository extends BaseRepository<HireRequirementResponsible> {
  constructor() {
    super(HireRequirementResponsible);
  }

  async bulkCreateResponsibleSale(
    id: number,
    user_ids: number[],
    transaction: Transaction,
  ) {
    const findIdsDelete = await this.findAll({
      where: {
        hire_requirement_id: id,
        user_id: {
          [Op.in]: user_ids,
        },
      },
    });

    const listIdsCreateFilter: any[] = [];

    if (findIdsDelete) {
      for (const item of findIdsDelete) {
        listIdsCreateFilter.push(item.user_id);
      }
    }

    const result = user_ids.filter(
      (item) => !listIdsCreateFilter.includes(item),
    );
    const dataCreated = result.map((e) => ({
      hire_requirement_id: id,
      user_id: e,
    }));
    try {
      await this.bulkCreate(dataCreated, { transaction });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể thêm dữ liệu hire_requirement_responsible lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async bulkDeleteResponsibleSale(
    id: number,
    user_ids: number[],
    transaction: Transaction,
  ) {
    const findIdsDelete = await this.findAll({
      where: {
        hire_requirement_id: id,
        user_id: {
          [Op.notIn]: user_ids,
        },
      },
    });
    if (findIdsDelete) {
      const findProvinceDeleteIDs = findIdsDelete.map((e) => e.user_id);
      try {
        await this.destroy({
          where: {
            hire_requirement_id: id,
            user_id: {
              [Op.in]: findProvinceDeleteIDs,
            },
          },
          transaction,
        });

        const result = user_ids.filter(
          (item) => !findProvinceDeleteIDs.includes(item),
        );

        return result;
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể xoá dữ liệu hire_requirement_responsible lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
