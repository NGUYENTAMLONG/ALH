// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Local dependencies
import { CandidateProvince } from '@models/candidate-province.model';
import { Op, Transaction } from 'sequelize';
import { BaseRepository } from './base.repository';

@Injectable()
export class CandidateProvinceRepository extends BaseRepository<CandidateProvince> {
  constructor() {
    super(CandidateProvince);
  }

  async bulkCreateProvince(
    id: number,
    province_ids: number[],
    transaction: Transaction,
  ) {
    const findIdsDelete = await this.findAll({
      where: {
        candidate_information_id: id,
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
      candidate_information_id: id,
      df_province_id: e,
    }));
    try {
      await this.bulkCreate(dataCreated, { transaction });
    } catch (error) {
      throw new HttpException(
        'Có lôi xảy ra không thể thêm dữ liệu candidate_province lúc này',
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
        candidate_information_id: id,
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
            candidate_information_id: id,
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
          'Có lôi xảy ra không thể xoá dữ liệu candidate_province lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
