// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Local dependencies
import { Gender } from '@models/gender.model';
import { Op } from 'sequelize';
import { BaseRepository } from './base.repository';

@Injectable()
export class GenderRepository extends BaseRepository<Gender> {
  constructor() {
    super(Gender);
  }

  async findGender(id: number) {
    try {
      return await this.findByPk(id);
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy giữ liệu giới tính lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllGender(ids: number[]) {
    try {
      return await this.findAll({
        where: {
          id: { [Op.in]: ids },
        },
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy thông tin giới tính lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
