// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Other dependencies
import sequelize, { Op, Transaction } from 'sequelize';

// Local files
import { AgeGroup } from '@models/age-group.model';
import { DFProvince } from '@models/df-province.model';
import { Gender } from '@models/gender.model';
import { JobType } from '@models/job-type.model';
import { ProfessionalField } from '@models/professional-field.model';
import { RecruitmentJobType } from '@models/recruitment-job-type.model';
import { RecruitmentTemplate } from '@models/recruitment-template.model';
import { SalaryRange } from '@models/salary-range.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { IS_ACTIVE } from '@utils/constants';
import { BaseRepository } from './base.repository';

@Injectable()
export class RecruitmentTemplateRepository extends BaseRepository<RecruitmentTemplate> {
  constructor() {
    super(RecruitmentTemplate);
  }

  async findAllIdName() {
    try {
      return await this.findAll({
        where: {
          status: IS_ACTIVE.ACTIVE,
        },
        attributes: ['id', 'name'],
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy danh sách id và tên mẫu tuyển dụng lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async destroyRecruitmentTemplate(id: number, transaction: Transaction) {
    try {
      await this.destroy({
        where: {
          id,
        },
        transaction,
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể xoá mẫu tuyển dụng lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateRecruitmentTemplate(
    id: number,
    data: any,
    transaction: Transaction,
  ) {
    try {
      return await this.update(data, {
        where: {
          id,
        },
        transaction,
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không cập nhật mẫu tuyển dụng lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findNameUpdate(id: number, name?: string) {
    try {
      return await this.findOne({
        where: {
          id: { [Op.ne]: id },
          name,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy dữ liệu mẫu yêu cầu tuyển dụng lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findRecruitmentTemplate(id: number) {
    try {
      return await this.findOne({
        where: {
          id,
        },
        include: [
          {
            model: ProfessionalField,
          },
          {
            model: RecruitmentJobType,
            include: [
              {
                model: JobType,
              },
            ],
          },
          {
            model: DFProvince,
          },
          {
            model: YearOfExperience,
          },
          {
            model: Gender,
          },
          {
            model: AgeGroup,
          },
          {
            model: SalaryRange,
          },
        ],
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy dữ liệu mẫu yêu cầu tuyển dụng lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllRecruitmentTemplate(options: any) {
    try {
      options.include = [
        {
          attributes: [],
          model: ProfessionalField,
        },
        {
          model: RecruitmentJobType,
          include: [
            {
              model: JobType,
            },
          ],
        },
        {
          attributes: [],
          model: DFProvince,
        },
      ];

      options.attributes = [
        'id',
        [sequelize.col('professional_field.name'), 'professional_field2'],
        [sequelize.col('df_province.name'), 'df_province'],
        'created_at',
        'status',
      ];

      const recruitmentTemplate: any = await this.findAll(options);

      for (const element of recruitmentTemplate) {
        let text = '';
        for (const recruitment_job_type of element.recruitment_job_type) {
          text = text.concat(recruitment_job_type.job_type.name, ', ');
        }
        element.dataValues.recruitment_job_type = text.replace(/,\s*$/gm, '.');
      }

      return recruitmentTemplate;
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy dữ liệu yêu cầu tuyển dụng lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createRecruitmentTemplate(data: any, transaction: Transaction) {
    try {
      return await this.create(data, { transaction });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể tạo mẫu tuyển dụng lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findName(name?: string) {
    try {
      return await this.findOne({
        where: {
          name,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy dữ liệu mẫu yêu cầu tuyển dụng lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
