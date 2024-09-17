// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Local dependencies
import { HireRequirement } from '@models/hire-requirement.model';
import { Transaction } from 'sequelize';
import { BaseRepository } from './base.repository';

@Injectable()
export class HireRequirementRepository extends BaseRepository<HireRequirement> {
  constructor() {
    super(HireRequirement);
  }

  async createHireRequirement(data: any, transaction: Transaction) {
    try {
      return await this.model.create(data, { transaction });
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        'Có lỗi xảy ra không thể tạo yêu cầu thuê lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findHireRequirement(id: number) {
    try {
      return await this.model.findOne({
        where: { id },
      });
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy yêu cầu thuê lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
