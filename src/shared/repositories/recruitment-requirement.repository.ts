// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Other dependencies
import { Transaction } from 'sequelize';

// Local files
import { AgeGroup } from '@models/age-group.model';
import { FeeOfRecruitmentRequirement } from '@models/fee-of-recruitment-requirement.model';
import { FeeType } from '@models/fee-type.model';
import { Gender } from '@models/gender.model';
import { JobType } from '@models/job-type.model';
import { ProfessionalField } from '@models/professional-field.model';
import { RecruitmentJobType } from '@models/recruitment-job-type.model';
import { RecruitmentRequirementFile } from '@models/recruitment-requirement-file.model';
import { RecruitmentRequirementProvince } from '@models/recruitment-requirement-province.model';
import { RecruitmentRequirement } from '@models/recruitment-requirement.model';
import { SalaryRange } from '@models/salary-range.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { CANDIDATE_RECRUITMENT_STATUS } from '@utils/constants';
import { generateUniqueWEPKey } from '@utils/generate-code-recruitment';
import { Sequelize } from 'sequelize-typescript';
import { BaseRepository } from './base.repository';
import { DFProvince } from '@models/df-province.model';
import { Position } from '@models/position.model';
import { Enterprise } from '@models/enterprise.model';
import { User } from '@models/user.model';
import { EnterpriseAddress } from '@models/enterprise-address.model';
import { DFWard } from '@models/df-ward.model';
import { DFDistrict } from '@models/df-district.model';
import { DFCareer } from '@models/df-career.model';

@Injectable()
export class RecruitmentRequirementRepository extends BaseRepository<RecruitmentRequirement> {
  constructor(private readonly sequelize: Sequelize) {
    super(RecruitmentRequirement);
  }

  async updateRecruitment(id: number, data: any, transaction: Transaction) {
    try {
      return await this.model.update(data, {
        where: {
          id,
        },
        transaction,
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể cập nhật yêu cầu tuyển dụng lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllRecruitment(options: any) {
    try {
      options.include = [
        { model: ProfessionalField },
        { model: Position },
        { model: DFCareer },
        { model: RecruitmentRequirementFile },
        {
          model: Enterprise,
          include: [
            { model: User, as: 'user' },
            {
              model: EnterpriseAddress,
              include: [
                {
                  model: DFProvince,
                },
                {
                  model: DFWard,
                },
                {
                  model: DFDistrict,
                },
              ],
            },
          ],
        },
        {
          model: RecruitmentRequirementProvince,
          include: [{ model: DFProvince }],
        },
        { model: SalaryRange },
        { model: YearOfExperience },
        { model: AgeGroup },
        { model: FeeOfRecruitmentRequirement, include: [{ model: FeeType }] },
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
          model: RecruitmentRequirementProvince,
          attributes: {
            include: [
              [
                Sequelize.literal(
                  `(
                    SELECT name FROM df_province
                    WHERE id = recruitment_requirement_province.df_province_id
                    LIMIT 1
                   )`,
                ),
                'province_name',
              ],
            ],
          },
        },
        { model: FeeOfRecruitmentRequirement, include: [{ model: FeeType }] },
        { model: RecruitmentRequirementFile },
      ];
      options.attributes = {
        include: [
          [
            Sequelize.literal(
              `(
          SELECT COUNT( DISTINCT candidate_information_id) FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          LIMIT 1
          )`,
            ),
            'candidate_count',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${CANDIDATE_RECRUITMENT_STATUS.PENDING})) as data FROM candidate_recruitment
           JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.PENDING}
          AND user.deleted_at IS NULL )`,
            ),
            'candidate_pending',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${CANDIDATE_RECRUITMENT_STATUS.APPROVE_CV})) as data FROM candidate_recruitment
           JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.APPROVE_CV}
          AND user.deleted_at IS NULL )`,
            ),
            'candidate_approve_cv',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${CANDIDATE_RECRUITMENT_STATUS.REJECT_CV})) as data FROM candidate_recruitment
           JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.REJECT_CV}
          AND user.deleted_at IS NULL )`,
            ),
            'candidate_reject_cv',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${CANDIDATE_RECRUITMENT_STATUS.SCHEDULE_INTERVIEW})) as data FROM candidate_recruitment
           JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.SCHEDULE_INTERVIEW}
          AND user.deleted_at IS NULL )`,
            ),
            'candidate_schedule_interview',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${CANDIDATE_RECRUITMENT_STATUS.RE_SCHEDULE_INTERVIEW})) as data FROM candidate_recruitment
           JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.RE_SCHEDULE_INTERVIEW}
          AND user.deleted_at IS NULL )`,
            ),
            'candidate_re_schedule_interview',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${CANDIDATE_RECRUITMENT_STATUS.SUCCESSFUL_INTERVIEW})) as data FROM candidate_recruitment
           JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.SUCCESSFUL_INTERVIEW}
          AND user.deleted_at IS NULL )`,
            ),
            'candidate_success_interview',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${CANDIDATE_RECRUITMENT_STATUS.FAIL_INTERVIEW})) as data FROM candidate_recruitment
           JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.FAIL_INTERVIEW}
          AND user.deleted_at IS NULL )`,
            ),
            'candidate_false_interview',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${CANDIDATE_RECRUITMENT_STATUS.GET_A_JOB})) as data FROM candidate_recruitment
           JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.GET_A_JOB}
          AND user.deleted_at IS NULL )`,
            ),
            'candidate_get_job',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${CANDIDATE_RECRUITMENT_STATUS.DO_NOT_GET_A_JOB})) as data FROM candidate_recruitment
           JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.DO_NOT_GET_A_JOB}
          AND user.deleted_at IS NULL )`,
            ),
            'candidate_do_not_get_job',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${CANDIDATE_RECRUITMENT_STATUS.OFFER_LATER})) as data FROM candidate_recruitment
           JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.OFFER_LATER}
          AND user.deleted_at IS NULL )`,
            ),
            'candidate_offer_latter',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${CANDIDATE_RECRUITMENT_STATUS.APPROVE_OFFER_LATER})) as data FROM candidate_recruitment
           JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.APPROVE_OFFER_LATER}
          AND user.deleted_at IS NULL )`,
            ),
            'candidate_approve_later',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${CANDIDATE_RECRUITMENT_STATUS.REJECT_OFFER_LATER})) as data FROM candidate_recruitment
           JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.REJECT_OFFER_LATER}
          AND user.deleted_at IS NULL )`,
            ),
            'candidate_reject_later',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${CANDIDATE_RECRUITMENT_STATUS.ON_BOARD})) as data FROM candidate_recruitment
           JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.ON_BOARD}
          AND user.deleted_at IS NULL )`,
            ),
            'candidate_on_board',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${CANDIDATE_RECRUITMENT_STATUS.WARRANTY_EXPIRED})) as data FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.WARRANTY_EXPIRED}
          AND user.deleted_at IS NULL )`,
            ),
            'candidate_warranty_expired',
          ],
        ],
      };

      const recruitment: any = await this.model.findAll(options);

      for (const element of recruitment) {
        let text = '';
        for (const recruitment_job_type of element.recruitment_job_type) {
          text = text.concat(recruitment_job_type.job_type.name, ', ');
        }
        element.dataValues.recruitment_job_type = text.replace(/,\s*$/gm, '.');
      }

      // recruitment.reduce((accumulator: any, innerArray: any) => {
      //   const innerValues = innerArray.recruitment_job_type.map(
      //     (value: any) => value.job_type.name,
      //   );
      //   innerArray.dataValues.recruitment_job_type = innerValues;
      // }, []);

      return recruitment;
    } catch (error) {
      console.log('ERROR----->', error);
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy dữ liệu yêu cầu tuyển dụng lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findRecruitment(id: number) {
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
          {
            model: RecruitmentRequirementProvince,
            attributes: {
              include: [
                [
                  Sequelize.literal(
                    `(
                      SELECT name FROM df_province
                      WHERE id = recruitment_requirement_province.df_province_id
                      LIMIT 1
                     )`,
                  ),
                  'province_name',
                ],
              ],
            },
          },
          { model: FeeOfRecruitmentRequirement, include: [{ model: FeeType }] },
          { model: RecruitmentRequirementFile },
        ],
      });
    } catch (error) {
      console.log('error', error);

      throw new HttpException(
        'Có lỗi xảy ra không thể lấy dữ liệu yêu cầu tuyển dụng lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createRecruitment(data: any, transaction: Transaction) {
    try {
      return await this.model.create(data, { transaction });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể tạo yêu cầu tuyển dụng lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async createCodeRecruitment() {
    try {
      const code = generateUniqueWEPKey();
      let foundCode;
      do {
        foundCode = await this.findCodeRecruitment(code);
      } while (foundCode);

      return code;
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy dữ liệu recruiment lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findCodeRecruitment(code: string) {
    return await this.findOne({
      where: {
        code,
      },
    });
  }
}
