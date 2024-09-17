// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// Local files
import { EnterpriseDataFieldSource } from '@models/enterprise-data-field-source.model';
import { EnterpriseDataFieldSourceRepository } from '@repositories/enterprise-data-field-source.repository';
import { EnterpriseDataFieldRepository } from '@repositories/enterprise-data-field.repository';
import { EnterpriseDataRepository } from '@repositories/enterprise-data.repository';
import { DATA_TYPE, IS_ACTIVE } from '@utils/constants';
import { convertCode } from '@utils/convert-code ';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { Op } from 'sequelize';
import { AdminCreateEnterpriseDataFieldDto } from '../dto/create-enterprise-data-field.dto';
import { AdminFilterEnterpriseDataFieldDto } from '../dto/filter-enterprise-data-field.dto';
import { AdminUpdateEnterpriseDataFieldDto } from '../dto/update-enterprise-data-field.dto';

@Injectable()
export class AdminEnterpriseDataFieldService {
  constructor(
    private readonly enterpriseDataFieldRepository: EnterpriseDataFieldRepository,
    private readonly enterpriseDataFieldSourceRepository: EnterpriseDataFieldSourceRepository,
    private readonly enterpriseDataRepository: EnterpriseDataRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: AdminCreateEnterpriseDataFieldDto) {
    const foundCode = await this.enterpriseDataFieldRepository.findOne({
      where: {
        code: dto.code,
      },
    });
    if (foundCode) {
      throw new HttpException(
        'Mã thuộc tính đã tồn tại trên hệ thống',
        HttpStatus.FOUND,
      );
    }

    const foundName = await this.enterpriseDataFieldRepository.findOne({
      where: {
        name: dto.name,
      },
    });
    if (foundName) {
      throw new HttpException(
        'Tên thuộc tính đã tồn tại trên hệ thống',
        HttpStatus.FOUND,
      );
    }
    if (dto.data_type == DATA_TYPE.OPTIONS) {
      if (!dto.options || dto.options.length == 0) {
        throw new HttpException(
          'Vui lòng thêm thuộc tính options',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      if (dto.options && dto.options.length > 0) {
        throw new HttpException(
          'Vui lòng không thêm thuộc tính options',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const enterpriseDataField = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        try {
          const enterpriseDataField =
            await this.enterpriseDataFieldRepository.create(
              {
                name: dto.name,
                code: dto.code,
                data_type: dto.data_type,
                order: dto.order,
              },
              { transaction },
            );
          if (dto.options && dto.options.length > 0) {
            const enterpriseDataFieldCodeCreated = dto.options.map((e) => ({
              code: dto.code,
              item_code: convertCode(e),
              value: e,
            }));
            await this.enterpriseDataFieldSourceRepository.bulkCreate(
              enterpriseDataFieldCodeCreated,
              { transaction },
            );
          }
          return enterpriseDataField;
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể tạo thuộc tính lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );
    return sendSuccess({
      data: enterpriseDataField,
      msg: 'Thêm mới thuộc tính thành công',
    });
  }

  async findAll(dto: AdminFilterEnterpriseDataFieldDto) {
    const whereConditions: any = {};
    if (dto.search) {
      whereConditions.name = { [Op.substring]: dto.search };
    }
    if (dto.status) {
      whereConditions.status = dto.status;
    }
    const options: any = {
      where: whereConditions,
      order: ['order'],
    };

    const count = await this.enterpriseDataFieldRepository.count(options);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const enterpriseDataFields =
      await this.enterpriseDataFieldRepository.findAll(options);
    const paging = {
      total_count,
      current_page,
      limit: dto.limit,
      offset,
    };
    return sendSuccess({
      data: enterpriseDataFields,
      paging,
      blocks: {
        status: [
          {
            status: IS_ACTIVE.ACTIVE,
            name: 'Hoạt động',
          },
          {
            status: IS_ACTIVE.INACTIVE,
            name: 'Ngừng hoạt động',
          },
        ],
      },
    });
  }

  async detail(id: number) {
    const enterpriseDataField: any =
      await this.enterpriseDataFieldRepository.findOne({
        where: {
          id: id,
        },
        include: {
          model: EnterpriseDataFieldSource,
        },
      });
    if (!enterpriseDataField) {
      throw new HttpException(
        'Thuộc tính không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    return sendSuccess({ data: enterpriseDataField });
  }

  async update(id: number, dto: AdminUpdateEnterpriseDataFieldDto) {
    const enterpriseDataField =
      await this.enterpriseDataFieldRepository.findByPk(id);
    if (!enterpriseDataField) {
      throw new HttpException(
        'Thuộc tính không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    if (enterpriseDataField.data_type == DATA_TYPE.OPTIONS) {
      if (!dto.options || dto.options.length == 0) {
        throw new HttpException(
          'Vui lòng nhập thuộc tính options của select',
          HttpStatus.BAD_REQUEST,
        );
      }
      const listOptionID = dto.options.map((e) => e.id);
      const listOptionNotZero = dto.options.filter((e) => e.id != 0);
      const enterpriseDataFieldSource =
        await this.enterpriseDataFieldSourceRepository.findAll({
          where: {
            code: enterpriseDataField.code,
            id: { [Op.notIn]: listOptionID },
          },
        });
      if (enterpriseDataFieldSource && enterpriseDataFieldSource.length > 0) {
        const findEnterpriseData = await this.enterpriseDataRepository.findAll({
          where: {
            enterprise_data_field_source_code: {
              [Op.in]: enterpriseDataFieldSource.map((item) => item.item_code),
            },
          },
        });
        if (findEnterpriseData && findEnterpriseData.length > 0) {
          throw new HttpException(
            'Thuộc tính đã được sử dụng cho Doanh nghiệp. Không xóa được thuộc tính options này',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      await this.sequelize.transaction(async (transaction: Transaction) => {
        try {
          await enterpriseDataField.update(
            {
              status: dto.status,
              order: dto.order,
            },
            { transaction },
          );
          // xóa option
          await this.enterpriseDataFieldSourceRepository.destroy({
            where: {
              code: enterpriseDataField.code,
              id: { [Op.notIn]: listOptionID },
            },
            transaction,
          });
          // tạo mới
          const listOptionZero = dto.options.filter((e) => e.id == 0);
          const optionCreated = listOptionZero.map((e) => ({
            code: enterpriseDataField.code,
            item_code: convertCode(e.name),
            value: e.name,
          }));
          await this.enterpriseDataFieldSourceRepository.bulkCreate(
            optionCreated,
            {
              transaction,
            },
          );
          // cập nhật
          for (let i = 0; i < listOptionNotZero.length; i++) {
            const foundEnterpriseDataField =
              await this.enterpriseDataFieldSourceRepository.findOne({
                where: { id: listOptionNotZero[i].id },
              });
            const itemCode = foundEnterpriseDataField?.item_code;
            await foundEnterpriseDataField?.update(
              {
                item_code: convertCode(listOptionNotZero[i].name),
                value: listOptionNotZero[i].name,
              },
              { transaction },
            );
            await this.enterpriseDataRepository.update(
              {
                enterprise_data_field_source_code: listOptionNotZero[i].name,
                value: listOptionNotZero[i].name,
              },
              {
                where: {
                  enterprise_data_field_code: enterpriseDataField.code,
                  enterprise_data_field_source_code: itemCode,
                },
                transaction,
              },
            );
          }
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể cập nhật thuộc tính lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
    } else {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        try {
          await enterpriseDataField.update(
            {
              status: dto.status,
              order: dto.order,
            },
            { transaction },
          );
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể cập nhật thuộc tính lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
    }

    return sendSuccess({
      data: enterpriseDataField,
      msg: 'Cập nhật thuộc tính thành công',
    });
  }

  async delete(id: number) {
    const enterpriseDataField =
      await this.enterpriseDataFieldRepository.findByPk(id);
    if (!enterpriseDataField) {
      throw new HttpException(
        'Thuộc tính không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const foundCodeUsed = await this.enterpriseDataRepository.findOne({
      where: { enterprise_data_field_code: enterpriseDataField.code },
    });
    if (foundCodeUsed) {
      throw new HttpException(
        'Thuộc tính đã được sử dụng. Không xóa được thuộc tính',
        HttpStatus.FOUND,
      );
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await enterpriseDataField.destroy({ transaction });
        await this.enterpriseDataFieldSourceRepository.destroy({
          where: { code: enterpriseDataField.code },
          transaction,
        });
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể xóa thuộc tính lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    return sendSuccess({ msg: 'Xóa thuộc tính thành công' });
  }
}
