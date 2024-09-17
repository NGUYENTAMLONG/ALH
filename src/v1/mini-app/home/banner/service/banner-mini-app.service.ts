//Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sendSuccess } from '@utils/send-success';
import { Sequelize } from 'sequelize-typescript';
import { BannerRepository } from '@repositories/banner.repository';
import { BANNER_STATUS, BANNER_TYPE } from '@utils/constants';
import { FilterBannerDto } from '../dto/banner.dto';
import { Op } from 'sequelize';
//Local dependencies

@Injectable()
export class BannerMiniAppService {
  constructor(
    private readonly bannerRepository: BannerRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async findAllActiveSlides(dto: FilterBannerDto) {
    const options: any = {};
    const conditions: any = {
      status: BANNER_STATUS.ACTIVE,
      type: BANNER_TYPE.BANNER,
    };

    if (dto?.to_role) {
      conditions.to_role = { [Op.in]: dto.to_role.split(',') };
    }

    options.where = conditions;

    const banners = await this.bannerRepository.findAll(options);

    return sendSuccess({ data: banners });
  }

  async findOne(id: number) {
    const banner = await this.bannerRepository.findByPk(id);

    if (!banner) {
      throw new HttpException(
        'Banner không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    return sendSuccess({ data: banner });
  }
}
