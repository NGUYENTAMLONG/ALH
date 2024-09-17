// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// Local files
import { UserDataFieldSource } from '@models/user-data-field-source.model';
import { UserDataField } from '@models/user-data-field.model';
import { UserDataFieldSourceRepository } from '@repositories/user-data-field-source.repository';
import { UserDataFieldRepository } from '@repositories/user-data-field.repository';
import { UserDataRepository } from '@repositories/user-data.repository';
import { DATA_TYPE, IS_ACTIVE } from '@utils/constants';
import { convertCode } from '@utils/convert-code ';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { Op } from 'sequelize';
import { AdminCreateUserDataFieldDto } from '../dto/create-user-data-field.dto';
import { AdminFilterUserDataFieldDto } from '../dto/filter-user-data-field.dto';
import { AdminUpdateUserDataFieldDto } from '../dto/update-user-data-field.dto';

@Injectable()
export class AdminUserDataFieldService {
  constructor(
    private readonly userDataFieldRepository: UserDataFieldRepository,
    private readonly userDataFieldSourceRepository: UserDataFieldSourceRepository,
    private readonly userDataRepository: UserDataRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: AdminCreateUserDataFieldDto) {
    const foundCode = await this.userDataFieldRepository.findOne({
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

    const foundName = await this.userDataFieldRepository.findOne({
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
    const userDataField: UserDataField | undefined =
      await this.sequelize.transaction(async (transaction: Transaction) => {
        try {
          const userDataField: UserDataField | undefined =
            await this.userDataFieldRepository.create(
              {
                name: dto.name,
                code: dto.code,
                data_type: dto.data_type,
                order: dto.order,
              },
              { transaction },
            );
          if (dto.options && dto.options.length > 0) {
            const userDataFieldCodeCreated = dto.options.map((e) => ({
              code: dto.code,
              item_code: convertCode(e),
              value: e,
            }));
            await this.userDataFieldSourceRepository.bulkCreate(
              userDataFieldCodeCreated,
              { transaction },
            );
          }
          return userDataField;
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể tạo thuộc tính lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
    return sendSuccess({
      data: userDataField,
      msg: 'Thêm mới thuộc tính thành công',
    });
  }

  async findAll(dto: AdminFilterUserDataFieldDto) {
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

    const count = await this.userDataFieldRepository.count(options);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const userDataFields = await this.userDataFieldRepository.findAll(options);
    const paging = {
      total_count,
      current_page,
      limit: dto.limit,
      offset,
    };
    return sendSuccess({
      data: userDataFields,
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
    const userDataField: any = await this.userDataFieldRepository.findOne({
      where: {
        id: id,
      },
      include: {
        model: UserDataFieldSource,
      },
    });
    if (!userDataField) {
      throw new HttpException(
        'Thuộc tính không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    return sendSuccess({ data: userDataField });
  }

  async update(id: number, dto: AdminUpdateUserDataFieldDto) {
    const userDataField = await this.userDataFieldRepository.findByPk(id);
    if (!userDataField) {
      throw new HttpException(
        'Thuộc tính không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    if (userDataField.data_type == DATA_TYPE.OPTIONS) {
      if (!dto.options || dto.options.length == 0) {
        throw new HttpException(
          'Vui lòng nhập thuộc tính options của select',
          HttpStatus.BAD_REQUEST,
        );
      }
      const listOptionID = dto.options.map((e) => e.id);
      const listOptionNotZero = dto.options.filter((e) => e.id != 0);
      const userDataFieldSource =
        await this.userDataFieldSourceRepository.findAll({
          where: {
            code: userDataField.code,
            id: { [Op.notIn]: listOptionID },
          },
        });
      if (userDataFieldSource && userDataFieldSource.length > 0) {
        const findUserData = await this.userDataRepository.findAll({
          where: {
            user_data_field_source_code: {
              [Op.in]: userDataFieldSource.map((item) => item.item_code),
            },
          },
        });
        if (findUserData && findUserData.length > 0) {
          throw new HttpException(
            'Thuộc tính đã được sử dụng cho User. Không xóa được thuộc tính options này',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      await this.sequelize.transaction(async (transaction: Transaction) => {
        try {
          await userDataField.update(
            {
              status: dto.status,
              order: dto.order,
            },
            { transaction },
          );
          // xóa option
          await this.userDataFieldSourceRepository.destroy({
            where: {
              code: userDataField.code,
              id: { [Op.notIn]: listOptionID },
            },
            transaction,
          });
          // tạo mới
          const listOptionZero = dto.options.filter((e) => e.id == 0);
          const optionCreated = listOptionZero.map((e) => ({
            code: userDataField.code,
            item_code: convertCode(e.name),
            value: e.name,
          }));
          await this.userDataFieldSourceRepository.bulkCreate(optionCreated, {
            transaction,
          });
          // cập nhật
          for (let i = 0; i < listOptionNotZero.length; i++) {
            const foundUserDataField =
              await this.userDataFieldSourceRepository.findOne({
                where: { id: listOptionNotZero[i].id },
              });
            const itemCode = foundUserDataField?.item_code;
            await foundUserDataField?.update(
              {
                item_code: convertCode(listOptionNotZero[i].name),
                value: listOptionNotZero[i].name,
              },
              { transaction },
            );
            await this.userDataRepository.update(
              {
                user_data_field_source_code: listOptionNotZero[i].name,
                value: listOptionNotZero[i].name,
              },
              {
                where: {
                  user_data_field_code: userDataField.code,
                  user_data_field_source_code: itemCode,
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
          await userDataField.update(
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
      data: userDataField,
      msg: 'Cập nhật thuộc tính thành công',
    });
  }

  async delete(id: number) {
    const userDataField = await this.userDataFieldRepository.findByPk(id);
    if (!userDataField) {
      throw new HttpException(
        'Thuộc tính không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const foundCodeUsed = await this.userDataRepository.findOne({
      where: { user_data_field_code: userDataField.code },
    });
    if (foundCodeUsed) {
      throw new HttpException(
        'Thuộc tính đã được sử dụng. Không xóa được thuộc tính',
        HttpStatus.FOUND,
      );
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await userDataField.destroy({ transaction });
        await this.userDataFieldSourceRepository.destroy({
          where: { code: userDataField.code },
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
