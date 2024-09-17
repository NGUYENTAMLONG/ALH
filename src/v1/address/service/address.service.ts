// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Other dependencies
import { Op } from 'sequelize';

// Local files
import { DFDistrictRepository } from '@repositories/df-district.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { DFWardRepository } from '@repositories/df-ward.repository';
import { sendSuccess } from '@utils/send-success';
import { FilterDistrictDto } from '../dto/filter-distric.dto';
import { FilterProvinceDto } from '../dto/filter-province.dto';
import { FilterWardDto } from '../dto/filter-ward.dto';

@Injectable()
export class AddressService {
  constructor(
    private readonly dfProvinceRepository: DFProvinceRepository,
    private readonly dfDistrictRepository: DFDistrictRepository,
    private readonly dfWardRepository: DFWardRepository,
  ) {}

  async findAllWard(dto: FilterWardDto) {
    try {
      if (!dto.df_district_id && !dto.search) {
        return sendSuccess({ data: [] });
      }

      const condition: any = {};
      if (dto.search) {
        condition.name = { [Op.like]: `%${dto.search || ''}%` };
      }

      if (dto.df_district_id) {
        condition.df_district_id = dto.df_district_id;
      }

      return sendSuccess({
        data: await this.dfWardRepository.findAll({
          where: condition,
        }),
      });
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'Có lỗi xảy ra không thể lấy danh sách phường xã lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllDistrict(dto: FilterDistrictDto) {
    try {
      if (!dto.df_province_id && !dto.search) {
        return sendSuccess({ data: [] });
      }

      const condition: any = {};
      if (dto.search) {
        condition.name = { [Op.like]: `%${dto.search || ''}%` };
      }

      if (dto.df_province_id) {
        condition.df_province_id = dto.df_province_id;
      }

      return sendSuccess({
        data: await this.dfDistrictRepository.findAll({
          where: condition,
        }),
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy danh sách thành phố lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllProvince(dto: FilterProvinceDto) {
    try {
      const condition: any = {};
      if (dto.search) {
        condition.name = { [Op.like]: `%${dto.search || ''}%` };
      }

      return sendSuccess({
        data: await this.dfProvinceRepository.findAll({
          where: condition,
        }),
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy danh sách thành phố lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
