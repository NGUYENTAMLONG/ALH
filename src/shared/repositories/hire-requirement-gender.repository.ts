// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Local dependencies
import { HireRequirementGender } from '@models/hire-requirement-gender.model';
import { Op, Transaction } from 'sequelize';
import { BaseRepository } from './base.repository';

@Injectable()
export class HireRequirementGenderRepository extends BaseRepository<HireRequirementGender> {
  constructor() {
    super(HireRequirementGender);
  }

  async bulkCreateGender(
    id: number,
    gender_ids: number[],
    transaction: Transaction,
  ) {
    const findIdsDelete = await this.findAll({
      where: {
        hire_requirement_id: id,
        gender_id: {
          [Op.in]: gender_ids,
        },
      },
    });

    const listIdsCreateFilter: any[] = [];

    if (findIdsDelete) {
      for (const item of findIdsDelete) {
        listIdsCreateFilter.push(item.gender_id);
      }
    }

    const result = gender_ids.filter(
      (item) => !listIdsCreateFilter.includes(item),
    );
    const dataCreated = result.map((e) => ({
      hire_requirement_id: id,
      gender_id: e,
    }));
    try {
      await this.bulkCreate(dataCreated, { transaction });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể thêm dữ liệu hire_requirement_gender lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async bulkDeleteGender(
    id: number,
    gender_ids: number[],
    transaction: Transaction,
  ) {
    const findIdsDelete = await this.findAll({
      where: {
        hire_requirement_id: id,
        gender_id: {
          [Op.notIn]: gender_ids,
        },
      },
    });
    if (findIdsDelete) {
      const findGenderDeleteIDs = findIdsDelete.map((e) => e.gender_id);
      try {
        await this.destroy({
          where: {
            hire_requirement_id: id,
            gender_id: {
              [Op.in]: findGenderDeleteIDs,
            },
          },
          transaction,
        });

        const result = gender_ids.filter(
          (item) => !findGenderDeleteIDs.includes(item),
        );

        return result;
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể xoá dữ liệu hire_requirement_gender lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
