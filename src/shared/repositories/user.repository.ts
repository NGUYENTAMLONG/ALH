// Nestjs dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Other dependencies
import { Op, Transaction } from 'sequelize';

// Local files
import { CreateEnterpriseUserDto } from '@enterprise/features/auth/dto/create-enterprise-user.dto';
import { User } from '@models/user.model';
import { IS_ACTIVE, ROLE, USER_STATUS } from '@utils/constants';
import { BaseRepository } from './base.repository';

enum Role {
  ADMIN = ROLE.ADMIN,
  ENTERPRISE = ROLE.ENTERPRISE,
}
@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  async findUserByIdAndRole(id: number, role: number) {
    try {
      return await this.findOne({
        where: {
          id,
          role_id: role,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy dữ liệu thông tin của người dùng Admin lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserByIdsAndRole(ids: number[], role: number) {
    try {
      return await this.findAll({
        where: {
          id: { [Op.in]: ids },
          role_id: role,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy dữ liệu thông tin của người dùng lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateEnterpriseAdmin(
    user_id: number,
    dto: {
      full_name: string;
      email: string;
      phone_number: string;
      alternate_phone: string | undefined;
      verify_password: string;
    },
    role: Role,
    transaction: Transaction,
  ): Promise<any> {
    try {
      let user;
      user = {
        role_id: role,
        full_name: dto.full_name,
        email: dto.email,
        phone_number: dto.phone_number,
        alternate_phone: dto.alternate_phone,
        password: dto.verify_password,
      };

      user = await this.model.update(user, {
        where: {
          id: user_id,
        },
        transaction,
      });

      return user;
    } catch (error) {
      console.log(error);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createEnterpriseAdmin(
    dto: {
      full_name: string;
      email: string;
      phone_number: string;
      alternate_phone: string | undefined;
      verify_password: string;
    },
    role: Role,
    transaction: Transaction,
  ): Promise<User> {
    try {
      let user;
      user = {
        role_id: role,
        full_name: dto.full_name,
        email: dto.email,
        phone_number: dto.phone_number,
        alternate_phone: dto.alternate_phone,
        password: dto.verify_password,
      };
      user = await this.model.create(user, { transaction });

      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async foundEmail(email: string): Promise<any> {
    try {
      return await this.model.findOne({
        where: {
          email,
          status: { [Op.in]: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE] },
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async alternatePhoneEnterprise(alternate_phone: string): Promise<any> {
    try {
      return await this.model.findOne({
        where: {
          alternate_phone,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async foundPhoneNumberEnterprise(phone_number: string): Promise<any> {
    try {
      return await this.model.findOne({
        where: {
          phone_number,
          role_id: ROLE.ENTERPRISE,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async foundPhoneNumber(phone_number: string): Promise<any> {
    try {
      return await this.model.findOne({
        where: {
          phone_number,
          status: { [Op.in]: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE] },
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async foundPhoneNumberCandidate(phone_number: string): Promise<any> {
    try {
      return await this.model.findOne({
        where: {
          phone_number,
          role_id: ROLE.CANDIDATE,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createUserWithRole(
    dto: CreateEnterpriseUserDto,
    role: Role,
    transaction: Transaction,
  ): Promise<User> {
    try {
      let user;
      user = {
        role_id: role,
        full_name: dto.full_name,
        email: dto.email,
        phone_number: dto.phone_number,
        alternate_phone: dto.alternate_phone,
        password: dto.verify_password,
      };

      user = await this.model.create(user, { transaction });

      return user;
    } catch (error) {
      console.log(error);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async foundUserByToken(token: string): Promise<any> {
    try {
      return await this.model.findOne({
        where: {
          token,
          status: IS_ACTIVE.ACTIVE,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createUser(dto: any, transaction: Transaction): Promise<User> {
    try {
      const user = await this.model.create(dto, { transaction });
      return user;
    } catch (error) {
      console.log(error);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
