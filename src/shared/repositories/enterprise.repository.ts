// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Local files
import { Enterprise } from '@models/enterprise.model';
import { IS_ACTIVE } from '@utils/constants';
import { Transaction } from 'sequelize';
import { CreateEnterpriseDto } from '../../v1/enterprise/features/auth/dto/create-enterprise.dto';
import { BaseRepository } from './base.repository';

@Injectable()
export class EnterpriseRepository extends BaseRepository<Enterprise> {
  constructor() {
    super(Enterprise);
  }

  async findEnterprise(user_id: number) {
    try {
      return await this.findOne({
        where: {
          user_id,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thẻ lấy dữ liệu doanh nghiệp lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateEnterpriseAdmin(
    enterprise_id: number,
    dto: {
      position: string | undefined;
      user_id: number;
      name: string;
      logo: string | null | undefined;
      description: string | undefined;
      status: number;
      tax_code: string | undefined;
      website: string | undefined;
      linkedin: string | undefined;
      facebook: string | undefined;
      salesperson: string | undefined;
      manager: string;
      professional_field_text: string | undefined;
      responsible_sale_id: number;
    },
    transaction: Transaction,
  ): Promise<any> {
    try {
      const enterprise = {
        position: dto.position,
        user_id: dto.user_id,
        name: dto.name,
        logo: dto.logo,
        description: dto.description,
        status: IS_ACTIVE.ACTIVE,
        tax_code: dto.tax_code,
        website: dto.website,
        linkedin: dto.linkedin,
        facebook: dto.facebook,
        salesperson: dto.salesperson,
        manager: dto.manager,
        professional_field_text: dto.professional_field_text,
        responsible_sale_id: dto.responsible_sale_id,
      };

      await this.model.update(enterprise, {
        where: {
          id: enterprise_id,
        },
        transaction,
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể tạo doanh nghiệp lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createEnterpriseAdmin(
    dto: {
      position: string | undefined;
      user_id: number;
      name: string;
      logo: string | null | undefined;
      description: string | undefined;
      status: number;
      tax_code: string | undefined;
      website: string | undefined;
      linkedin: string | undefined;
      facebook: string | undefined;
      salesperson: string | undefined;
      manager: string;
      professional_field_text: string;
      responsible_sale_id: number;
    },
    transaction: Transaction,
  ): Promise<any> {
    try {
      const enterprise = {
        position: dto.position,
        user_id: dto.user_id,
        name: dto.name,
        logo: dto.logo,
        description: dto.description,
        status: IS_ACTIVE.ACTIVE,
        tax_code: dto.tax_code,
        website: dto.website,
        linkedin: dto.linkedin,
        facebook: dto.facebook,
        salesperson: dto.salesperson,
        manager: dto.manager,
        professional_field_text: dto.professional_field_text,
        responsible_sale_id: dto.responsible_sale_id,
      };

      return await this.model.create(enterprise, { transaction });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể tạo doanh nghiệp lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createEnterprise(
    dto: CreateEnterpriseDto,
    transaction: Transaction,
  ): Promise<any> {
    try {
      const enterprise = {
        position: dto.position || null,
        user_id: dto.user_id,
        name: dto.name,
      };

      return await this.model.create(enterprise, { transaction });
    } catch (error) {
      console.log('error: ', error);

      throw new HttpException(
        'Có lỗi xảy ra không thể tạo doanh nghiệp lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
