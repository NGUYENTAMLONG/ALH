// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Local dependencies
import { RecruitmentRequirementProvince } from '@models/recruitment-requirement-province.model';
import { Op, Transaction } from 'sequelize';
import { BaseRepository } from './base.repository';

@Injectable()
export class RecruitmentRequirementProvinceRepository extends BaseRepository<RecruitmentRequirementProvince> {
  constructor() {
    super(RecruitmentRequirementProvince);
  }
  async bulkCreateProvince(
    id: number,
    province_ids: number[],
    transaction: Transaction,
  ) {
    const findIdsDelete = await this.findAll({
      where: {
        recruitment_requirement_id: id,
        df_province_id: {
          [Op.in]: province_ids,
        },
      },
    });

    const listIdsCreateFilter: any[] = [];

    if (findIdsDelete) {
      for (const item of findIdsDelete) {
        listIdsCreateFilter.push(item.df_province_id);
      }
    }

    const result = province_ids.filter(
      (item) => !listIdsCreateFilter.includes(item),
    );
    const dataCreated = result.map((e) => ({
      recruitment_requirement_id: id,
      df_province_id: e,
    }));
    try {
      await this.bulkCreate(dataCreated, { transaction });
    } catch (error) {
      throw new HttpException(
        'Có lôi xảy ra không thể thêm dữ liệu recruitment_requirement_province lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async bulkDeleteProvince(
    id: number,
    province_ids: number[],
    transaction: Transaction,
  ) {
    const findIdsDelete = await this.findAll({
      where: {
        recruitment_requirement_id: id,
        df_province_id: {
          [Op.notIn]: province_ids,
        },
      },
    });
    if (findIdsDelete) {
      const findProvinceDeleteIDs = findIdsDelete.map((e) => e.df_province_id);
      try {
        await this.destroy({
          where: {
            recruitment_requirement_id: id,
            df_province_id: {
              [Op.in]: findProvinceDeleteIDs,
            },
          },
          transaction,
        });

        const result = province_ids.filter(
          (item) => !findProvinceDeleteIDs.includes(item),
        );

        return result;
      } catch (error) {
        throw new HttpException(
          'Có lôi xảy ra không thể xoá dữ liệu recruitment_requirement_province lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
