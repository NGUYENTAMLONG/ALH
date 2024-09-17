import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BannerRepository } from '@repositories/banner.repository';
import { PositionRepository } from '@repositories/position.repository';
import { convertDateTime, getDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  CreateBannerDto,
  FilterBannerDto,
  UpdateBannerDto,
  UpdateBannerStatusDto,
} from '../dto/banner.dto';
import { BANNER_STATUS, BANNER_TYPE, ROLE } from '@utils/constants';
import { Banner } from '@models/banner.model';

@Injectable()
export class AdminBannerService {
  constructor(
    private readonly bannerRepository: BannerRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreateBannerDto, user_id?: number) {
    if (dto?.code) {
      const existedBanner = await this.bannerRepository.findOne({
        where: {
          code: dto.code,
        },
      });
      if (existedBanner) {
        throw new HttpException(
          `Banner có mã code = ${dto.code} đã tồn tại trên hệ thống`,
          HttpStatus.FOUND,
        );
      }
    }

    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        try {
          const payloadCreate = {
            code: dto?.code || null,
            title: dto?.title || null,
            url: dto?.url,
            type: dto?.type,
            to_role: dto?.to_role || null,
            description: dto?.description,
            navigate_id: dto?.navigate_id || null,
            navigate_link: dto?.navigate_link || null,
            status: BANNER_STATUS.ACTIVE,
          };
          const banner = await this.bannerRepository.create(payloadCreate, {
            transaction,
          });
          return banner;
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể tạo banner vào lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );
    return sendSuccess({ data: result, msg: 'Thêm mới thành công banner' });
  }

  async findAllActiveSlides() {
    const banners = await this.bannerRepository.findAll({
      where: {
        status: BANNER_STATUS.ACTIVE,
      },
    });

    return sendSuccess({ data: banners });
  }

  async findAll(dto: FilterBannerDto) {
    const options: any = {};
    const conditions: any = {};
    if (dto.search) {
      conditions.title = { [Op.like]: `%${dto.search || ''}%` };
    }

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      conditions.created_at = { [Op.between]: [fromDate, toDate] };
    }

    if (dto.status) {
      conditions.status = { [Op.in]: dto.status.split(',') };
    }

    if (dto.type) {
      conditions.type = { [Op.in]: dto.type.split(',') };
    }

    if (dto.to_role) {
      conditions.to_role = { [Op.in]: dto.to_role.split(',') };
    }

    const count = await this.bannerRepository.count({
      where: conditions,
    });

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );
    if (dto.page || dto.limit) {
      (options.offset = offset), (options.limit = page_size);
    }

    options.where = conditions;
    const positions = await this.bannerRepository.findAll(options);

    const paging = {
      total_count,
      current_page,
      limit: dto.limit,
      offset,
    };
    return sendSuccess({ data: positions, paging });
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

  async update(dto: UpdateBannerDto) {
    const { banner_id } = dto;
    const foundBanner = await Banner.findByPk(banner_id);
    if (!foundBanner) {
      throw new HttpException(
        `Banner không tồn tại trên hệ thống`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (dto?.code) {
      const existedBanner = await this.bannerRepository.findOne({
        where: {
          code: dto.code,
          id: {
            [Op.ne]: dto.banner_id,
          },
        },
      });
      if (existedBanner) {
        throw new HttpException(
          `Banner có mã code = ${dto.code} đã tồn tại trên hệ thống`,
          HttpStatus.FOUND,
        );
      }
    }

    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        try {
          const payloadUpdate = {
            code: dto?.code || null,
            title: dto?.title || null,
            url: dto?.url,
            type: dto?.type,
            to_role: dto?.to_role || null,
            description: dto?.description,
            navigate_id: dto?.navigate_id || null,
            navigate_link: dto?.navigate_link || null,
            status: dto?.status,
          };
          const banner = await this.bannerRepository.update(payloadUpdate, {
            where: {
              id: dto.banner_id,
            },
            transaction,
          });
          return banner;
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể cập nhật banner vào lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );
    return sendSuccess({ data: result, msg: 'Cập nhật thành công banner' });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await this.bannerRepository.destroy({
          where: {
            id,
          },
          transaction,
        });
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể xoá banner vào lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });

    return sendSuccess({ data: { id }, msg: 'Xoá banner thành công' });
  }

  async updateStatus(dto: UpdateBannerStatusDto) {
    const { banner_id } = dto;
    const foundBanner = await Banner.findByPk(banner_id);
    if (!foundBanner) {
      throw new HttpException(
        `Banner không tồn tại trên hệ thống`,
        HttpStatus.NOT_FOUND,
      );
    }

    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        try {
          const payloadUpdate = {
            status: dto?.status,
          };
          const banner = await this.bannerRepository.update(
            {
              payloadUpdate,
            },
            {
              where: {
                id: dto.banner_id,
              },
              transaction,
            },
          );
          return banner;
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể cập nhật trạng thái vào lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );
    return sendSuccess({ data: result, msg: 'Cập nhật thành công trạng thái' });
  }
}
