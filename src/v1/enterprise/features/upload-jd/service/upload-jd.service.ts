// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Other dependencies
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

// Local files
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { FeeOfRecruitmentRequirementRepository } from '@repositories/fee-of-recruitment-requirement.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { configService } from '@services/config.service';
import {
  RECRUITMENT_REQUIREMENT_TYPE,
  RECRUITMENT_STATUS,
} from '@utils/constants';
import { getDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { CreateUploadJdDto } from '../dto/create-upload-jd.dto';
import { FilterUploadJdFileDto } from '../dto/filter-upload-jd-file.dto';

@Injectable()
export class UploadJdService {
  private readonly enterpriseStatus = RECRUITMENT_STATUS;

  constructor(
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly recruitmentRequirementRepository: RecruitmentRequirementRepository,
    private readonly feeOfRecruitmentRequirementRepository: FeeOfRecruitmentRequirementRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async findOneJdFile(user_id: number, jd_file_id: number) {
    const conditions: any = {};

    const enterprise = await this.enterpriseRepository.findOne({
      where: {
        user_id,
      },
    });
    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    conditions.enterprise_id = enterprise?.id;
    conditions.id = jd_file_id;
    const recruitment = await this.recruitmentRequirementRepository.findOne({
      where: conditions,
    });

    return sendSuccess({
      data: recruitment,
      blocks: {
        status: RECRUITMENT_STATUS,
      },
    });
  }

  async findAllJdFile(id: number, dto: FilterUploadJdFileDto) {
    const options: any = {
      order: [['id', 'DESC']],
    };

    const conditions: any = {
      recruitment_requirement_type_id: RECRUITMENT_REQUIREMENT_TYPE.JD_FILE,
    };

    const enterprise = await this.enterpriseRepository.findOne({
      where: {
        user_id: id,
      },
    });

    conditions.enterprise_id = enterprise?.id;

    if (dto.search) {
      conditions.code = { [Op.like]: `%${dto.search || ''}%` };
    }

    if (dto.status) {
      conditions.status = dto.status;
    }

    if (dto.from_date && dto.to_date) {
      const fromDate = getDateTime(dto.from_date, 'fmonth');
      const toDate = getDateTime(dto.to_date, 'lmonth');

      conditions.created_at = { [Op.between]: [fromDate, toDate] };
    }

    const count = await this.recruitmentRequirementRepository.count({
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

    const jdFiles = await this.recruitmentRequirementRepository.findAll(
      options,
    );

    const paging = {
      total_count,
      current_page,
      limit: dto.limit,
      offset,
    };

    return sendSuccess({
      data: jdFiles,
      paging,
      blocks: {
        status: RECRUITMENT_STATUS,
      },
    });
  }

  async saveJdFile(id: number, dto: CreateUploadJdDto) {
    const enterprise = await this.enterpriseRepository.findOne({
      where: {
        user_id: id,
      },
    });

    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    let recruitmentRequirement = RECRUITMENT_REQUIREMENT_TYPE.JD_FILE;
    if (dto.fee_type_id) {
      recruitmentRequirement = RECRUITMENT_REQUIREMENT_TYPE.RECRUITMENT;
    }
    const payloadCreateRecruitmentFile = {
      enterprise_id: enterprise.id,
      file: dto.jd,
      status: this.enterpriseStatus.PENDING,
      created_by: id,
      recruitment_requirement_type_id: recruitmentRequirement,
    };

    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        try {
          const recruitment =
            await this.recruitmentRequirementRepository.create(
              payloadCreateRecruitmentFile,
              {
                transaction,
              },
            );
          if (dto.fee_type_id) {
            await this.feeOfRecruitmentRequirementRepository.create(
              {
                fee_type_id: dto.fee_type_id,
                recruitment_requirement_id: recruitment?.id,
                price: dto.price || null,
              },
              { transaction },
            );
          }
          const code =
            await this.recruitmentRequirementRepository.createCodeRecruitment();

          await recruitment?.update({ code }, { transaction });

          await recruitment?.save();

          return recruitment;
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể upload file JD lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );

    return sendSuccess({
      data: result,
      status: HttpStatus.CREATED,
      links: {
        jd: `${configService.getEnv('APP_DOMAIN')}/${dto.jd}`,
      },
    });
  }
}
