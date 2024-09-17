import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PositionRepository } from '@repositories/position.repository';
import { getDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreatePositionDto } from '../dto/create-position.dto';
import { FilterPositionDto } from '../dto/filter-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';

@Injectable()
export class AdminPositionService {
  constructor(
    private readonly positionRepository: PositionRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreatePositionDto) {
    const position = await this.positionRepository.findOne({
      where: {
        name: dto.name,
      },
    });

    if (position) {
      throw new HttpException(
        'Tên chức vụ đã tồn tại trên hệ thống',
        HttpStatus.FOUND,
      );
    }

    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        try {
          const position = await this.positionRepository.create(dto, {
            transaction,
          });

          return position;
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể tạo chức vụ vào lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );

    return sendSuccess({ data: result, msg: 'Thêm mới thành công chức vụ' });
  }

  async findAll(dto: FilterPositionDto) {
    const options: any = {};
    const conditions: any = {};

    if (dto.search) {
      conditions.name = { [Op.like]: `${dto.search || ''}` };
    }

    if (dto.from_date && dto.to_date) {
      const fromDate = getDateTime(dto.from_date, 'fmonth');
      const toDate = getDateTime(dto.to_date, 'lmonth');

      conditions.created_at = { [Op.between]: [fromDate, toDate] };
    }

    const count = await this.positionRepository.count({
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

    const positions = await this.positionRepository.findAll(options);

    const paging = {
      total_count,
      current_page,
      limit: dto.limit,
      offset,
    };

    return sendSuccess({ data: positions, paging });
  }

  async findOne(id: number) {
    const position = await this.positionRepository.findByPk(id);

    if (!position) {
      throw new HttpException(
        'Chức vụ không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    return sendSuccess({ data: position });
  }

  async update(id: number, dto: UpdatePositionDto) {
    const position: any = await this.positionRepository.findByPk(id);

    if (!position) {
      throw new HttpException(
        'Chức vụ không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await this.positionRepository.update(dto, {
          where: {
            id,
          },
          transaction,
        });
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể tạo chức vụ vào lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });

    position.name = dto.name;

    return sendSuccess({
      data: position,
      msg: 'Cập nhật chức vụ thành công',
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await this.positionRepository.destroy({
          where: {
            id,
          },
          transaction,
        });
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể xoá chức vụ vào lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });

    return sendSuccess({ data: { id }, msg: 'Xoá chức vụ thành công' });
  }
}
