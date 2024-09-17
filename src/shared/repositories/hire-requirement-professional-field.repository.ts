// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Local dependencies
import { HireRequirementProfessionalField } from '@models/hire-requirement-professional-field.model';
import { Op, Transaction } from 'sequelize';
import { BaseRepository } from './base.repository';

@Injectable()
export class HireRequirementProfessionalFieldRepository extends BaseRepository<HireRequirementProfessionalField> {
  constructor() {
    super(HireRequirementProfessionalField);
  }

  async bulkCreateProfessionalField(
    id: number,
    professional_field_ids: number[],
    transaction: Transaction,
  ) {
    const findIdsDelete = await this.findAll({
      where: {
        hire_requirement_id: id,
        professional_field_id: {
          [Op.in]: professional_field_ids,
        },
      },
    });

    const listIdsCreateFilter: any[] = [];

    if (findIdsDelete) {
      for (const item of findIdsDelete) {
        listIdsCreateFilter.push(item.professional_field_id);
      }
    }

    const result = professional_field_ids.filter(
      (item) => !listIdsCreateFilter.includes(item),
    );
    const dataCreated = result.map((e) => ({
      hire_requirement_id: id,
      professional_field_id: e,
    }));
    try {
      await this.bulkCreate(dataCreated, { transaction });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể thêm dữ liệu hire_requirement_professional_field lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async bulkDeleteProfessionalField(
    id: number,
    professional_field_ids: number[],
    transaction: Transaction,
  ) {
    const findIdsDelete = await this.findAll({
      where: {
        hire_requirement_id: id,
        professional_field_id: {
          [Op.notIn]: professional_field_ids,
        },
      },
    });
    if (findIdsDelete) {
      const findProfessionalFieldDeleteIDs = findIdsDelete.map(
        (e) => e.professional_field_id,
      );
      try {
        await this.destroy({
          where: {
            hire_requirement_id: id,
            professional_field_id: {
              [Op.in]: findProfessionalFieldDeleteIDs,
            },
          },
          transaction,
        });

        const result = professional_field_ids.filter(
          (item) => !findProfessionalFieldDeleteIDs.includes(item),
        );

        return result;
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể xoá dữ liệu hire_requirement_professional_field lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
