import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { getDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateProfessionalFieldDto } from '../dto/create-professional-field.dto';
import { FilterProfessionalField } from '../dto/filter-professional-field.dto';
import { UpdateProfessionalFieldDto } from '../dto/update-professional-field.dto';

@Injectable()
export class AdminProfessionalFieldService {
  constructor(
    private readonly professionalRepository: ProfessionalFieldRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreateProfessionalFieldDto) {
    let professionField;
    professionField = await this.professionalRepository.findOne({
      where: {
        name: dto.name,
      },
    });

    if (professionField) {
      throw new HttpException(
        'Lĩnh vực đã tồn tại trên hệ thống',
        HttpStatus.FOUND,
      );
    }

    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        professionField = await this.professionalRepository.create(dto, {
          transaction,
        });
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể tạo lĩnh vực vào lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });

    return sendSuccess({
      data: professionField,
      msg: 'Thêm mới lĩnh vực thành công',
    });
  }

  async findAll(dto: FilterProfessionalField) {
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

    const count = await this.professionalRepository.count({
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

    const professionalField = await this.professionalRepository.findAll(
      options,
    );

    const paging = {
      total_count,
      current_page,
      limit: dto.limit,
      offset,
    };

    return sendSuccess({ data: professionalField, paging });
  }

  async findOne(id: number) {
    const professionalField = await this.professionalRepository.findByPk(id);

    if (!professionalField) {
      throw new HttpException(
        'Lĩnh vực chuyên môn không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    return sendSuccess({ data: professionalField });
  }

  async update(id: number, dto: UpdateProfessionalFieldDto) {
    const professionalField: any = await this.professionalRepository.findByPk(
      id,
    );

    if (!professionalField) {
      throw new HttpException(
        'Lĩnh vực chuyên môn không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await professionalField.update(dto, { transaction });
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể cập nhật thông tin lĩnh vực lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });

    professionalField.name = dto.name;
    professionalField.description = dto.description;

    return sendSuccess({
      data: professionalField,
      msg: 'Cập nhật thông tin chi tiết lĩnh vực thành công',
    });
  }

  async remove(id: number) {
    const professionalField = await this.professionalRepository.findByPk(id);

    if (!professionalField) {
      throw new HttpException(
        'Lĩnh vực chuyên môn không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await professionalField.destroy({ transaction });
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể xoá thông tin lĩnh vực lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    return sendSuccess({ data: { id }, msg: 'Xoá lĩnh vực thành công' });
  }
}
