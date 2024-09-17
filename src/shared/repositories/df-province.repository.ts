// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Local files
import { DFProvince } from '@models/df-province.model';
import { Op } from 'sequelize';
import { BaseRepository } from './base.repository';

@Injectable()
export class DFProvinceRepository extends BaseRepository<DFProvince> {
  constructor() {
    super(DFProvince);
  }

  async findProvince(id: number) {
    try {
      return await this.findByPk(id);
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy thông tin khu vực làm việc lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllProvince(ids: number[]) {
    try {
      return await this.findAll({
        where: {
          id: { [Op.in]: ids },
        },
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy thông tin khu vực làm việc lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
