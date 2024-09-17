// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// Local files
import { AgeGroup } from '@models/age-group.model';
import { CandidateFile } from '@models/candidate-file.model';
import { CandidateImage } from '@models/candidate-image.model';
import { CandidateInformationFile } from '@models/candidate-information-file.model';
import { CandidateInterview } from '@models/candidate-interview.model';
import { CandidateJobType } from '@models/candidate-job-type.model';
import { CandidateProvince } from '@models/candidate-province.model';
import { HirePrice } from '@models/hire-price.model';
import { User } from '@models/user.model';
import { WorkExperience } from '@models/work-experience.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { AgeGroupRepository } from '@repositories/age-group.repository';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateJobTypeRepository } from '@repositories/candidate-job-type.repository';
import { CandidateProvinceRepository } from '@repositories/candidate-province.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { HirePriceRepository } from '@repositories/hire-price.repository';
import { InterestListJobTypeRepository } from '@repositories/interest-list-job-type.repository';
import { InterestListProvinceRepository } from '@repositories/interest-list-province.repository';
import { InterestListTransactionRepository } from '@repositories/interest-list-transaction.repository';
import { InterestListRepository } from '@repositories/interest-list.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { NotificationService } from '@services/notification.service';
import {
  CANDIDATE_STATUS,
  INTEREST_LIST_STATUS,
  IS_ACTIVE,
  NOTIFICATION_TYPE,
  NotificationPayload,
  ROLE,
} from '@utils/constants';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { FilterDetailEnterpriseCandidateDto } from '../dto/filter-detail-enterprise-candidate.dto';
import { FilterEnterpriseCandidateDto } from '../dto/filter-enterprise-candidate.dto';
import { CandidateApply } from '@models/candidate-apply.model';
import { CandidateApplyFile } from '@models/candidate-apply-file.model';
import { CandidateRecruitment } from '@models/candidate-recruitment.model';

@Injectable()
export class EnterpriseCandidateService {
  constructor(
    private readonly candidateInformationRepository: CandidateInformationRepository,
    private readonly ageGroupRepository: AgeGroupRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly professionalFieldRepository: ProfessionalFieldRepository,
    private readonly hirePriceRepository: HirePriceRepository,
    private readonly interestListRepository: InterestListRepository,
    private readonly candidateJobTypeRepository: CandidateJobTypeRepository,
    private readonly interestListTransactionRepository: InterestListTransactionRepository,
    private readonly notificationService: NotificationService,
    private readonly candidateProvinceRepository: CandidateProvinceRepository,
    private readonly interestListProvinceRepository: InterestListProvinceRepository,
    private readonly interestListJobTypeRepository: InterestListJobTypeRepository,
    private readonly candidateRecruitmentRepository: CandidateRecruitmentRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async getListCandidate(user_id: number, dto: FilterEnterpriseCandidateDto) {
    let enterprise: any;
    if (user_id) {
      enterprise = await this.enterpriseRepository.findEnterprise(user_id);

      if (!enterprise) {
        throw new HttpException(
          'Doanh nghiệp không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const whereCondition: any = {
      status: { [Op.ne]: CANDIDATE_STATUS.CLOSE_CV },
      is_hire: IS_ACTIVE.ACTIVE,
      [Op.and]: [],
    };
    if (dto.professional_field_ids) {
      whereCondition.professional_field_id = {
        [Op.in]: dto.professional_field_ids.split(','),
      };
    }
    const conditions: any[] = [];
    if (dto.age_group_ids) {
      const ageGroup: AgeGroup[] | null = await this.ageGroupRepository.findAll(
        {
          where: {
            id: { [Op.in]: dto.age_group_ids.split(',') },
          },
        },
      );
      if (ageGroup && ageGroup.length > 0) {
        for (let i = 0; i < ageGroup.length; i++) {
          const currentDate = new Date();
          const minBirthDate = new Date(
            currentDate.getFullYear() - ageGroup[i].max_age,
            currentDate.getMonth(),
            currentDate.getDate(),
          );
          const maxBirthDate = new Date(
            currentDate.getFullYear() - ageGroup[i].min_age,
            currentDate.getMonth(),
            currentDate.getDate(),
          );
          conditions.push({
            date_of_birth: { [Op.between]: [minBirthDate, maxBirthDate] },
          });
        }
      }
    }
    if (dto.years_of_experience_ids) {
      whereCondition.years_of_experience_id = {
        [Op.in]: dto.years_of_experience_ids.split(','),
      };
    }
    if (dto.salary_range_ids) {
      whereCondition.salary_range_id = {
        [Op.in]: dto.salary_range_ids.split(','),
      };
    }
    if (dto.job_type_ids) {
      whereCondition[Op.and].push({
        id: {
          [Op.in]: [
            Sequelize.literal(
              `SELECT candidate_information_id FROM candidate_job_type where job_type_id in (${dto.job_type_ids}) AND candidate_information_id = CandidateInformation.id`,
            ),
          ],
        },
      });
    }
    if (dto.df_province_ids) {
      whereCondition[Op.and].push({
        id: {
          [Op.in]: [
            Sequelize.literal(
              `SELECT candidate_information_id FROM candidate_province where df_province_id in (${dto.df_province_ids}) AND candidate_information_id = CandidateInformation.id`,
            ),
          ],
        },
      });
    }
    const options: any = {
      attributes: {
        include: [
          [
            this.sequelize.literal(
              `(
              SELECT COUNT(DISTINCT interest_list_transaction.interest_list_id) FROM interest_list_transaction
              JOIN interest_list ON interest_list.id = interest_list_transaction.interest_list_id
              WHERE interest_list_transaction.candidate_information_id = CandidateInformation.id
              AND interest_list_transaction.status = ${
                INTEREST_LIST_STATUS.WAITING_APPROVE
              }
              AND interest_list.enterprise_id = ${
                enterprise ? enterprise.id : 0
              }
              LIMIT 1
             )`,
            ),
            'choose_count',
          ],
          [
            this.sequelize.literal(
              `(
              SELECT IF(COUNT(id)>0,true,false) FROM interest_list
              WHERE interest_list.candidate_information_id = CandidateInformation.id
              AND interest_list.deleted_at IS NULL
              AND interest_list.enterprise_id = ${
                enterprise ? enterprise.id : 0
              }
              LIMIT 1
             )`,
            ),
            'is_choose',
          ],
          [
            this.sequelize.literal(
              `IF( DATEDIFF(NOW(), CandidateInformation.created_at) > 2, false, true)`,
            ),
            'is_new',
          ],
        ],
      },
      where: whereCondition,
      include: [
        {
          model: User,
          where: {
            ...(dto.gender_ids
              ? { gender_id: { [Op.in]: dto.gender_ids.split(',') } }
              : {}),
            ...(conditions.length > 0 ? { [Op.or]: conditions } : {}),
          },
        },
        {
          model: CandidateJobType,
          attributes: {
            include: [
              [
                this.sequelize.literal(
                  `(
                    SELECT name FROM job_type
                    WHERE id = candidate_job_type.job_type_id
                    LIMIT 1
                   )`,
                ),
                'job_type_name',
              ],
            ],
          },
        },
        {
          model: HirePrice,
        },
        {
          model: YearOfExperience,
        },
        {
          model: CandidateFile,
        },
        {
          model: CandidateImage,
        },
        {
          model: CandidateProvince,
          attributes: {
            include: [
              [
                this.sequelize.literal(
                  `(
                    SELECT name FROM df_province
                    WHERE id = candidate_province.df_province_id
                    LIMIT 1
                   )`,
                ),
                'province_name',
              ],
            ],
          },
        },
      ],
      order: [['id', 'DESC']],
    };
    const countOptions: any = {
      ...options,
      distinct: true,
      col: 'id',
    };
    const count = await this.candidateInformationRepository.count(countOptions);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const candidates = await this.candidateInformationRepository.findAll(
      options,
    );
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({ data: candidates, paging });
  }

  async detailCandidate(
    user_id: number,
    id: number,
    dto: FilterDetailEnterpriseCandidateDto,
  ) {
    const enterprise = await this.enterpriseRepository.findEnterprise(user_id);

    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const options: any = {
      attributes: {
        include: [
          [
            this.sequelize.literal(
              `(
              SELECT COUNT(DISTINCT interest_list_transaction.interest_list_id) FROM interest_list_transaction
              JOIN interest_list ON interest_list.id = interest_list_transaction.interest_list_id
              WHERE interest_list_transaction.candidate_information_id = CandidateInformation.id
              AND interest_list_transaction.status = ${INTEREST_LIST_STATUS.WAITING_APPROVE}
              AND interest_list.enterprise_id = ${enterprise.id}
              LIMIT 1
             )`,
            ),
            'choose_count',
          ],
          [
            this.sequelize.literal(
              `(
              SELECT status FROM interest_list
              WHERE candidate_information_id = CandidateInformation.id
              AND enterprise_id = ${enterprise.id}
              ORDER BY id DESC
              LIMIT 1
             )`,
            ),
            'interest_status',
          ],
        ],
      },
      where: { id },
      include: [
        { model: User },
        {
          model: CandidateJobType,
          attributes: {
            include: [
              [
                this.sequelize.literal(
                  `(
                    SELECT name FROM job_type
                    WHERE id = candidate_job_type.job_type_id
                    LIMIT 1
                   )`,
                ),
                'job_type_name',
              ],
            ],
          },
        },
        {
          model: CandidateProvince,
          attributes: {
            include: [
              [
                this.sequelize.literal(
                  `(
                    SELECT name FROM df_province
                    WHERE id = candidate_province.df_province_id
                    LIMIT 1
                   )`,
                ),
                'province_name',
              ],
            ],
          },
        },
        {
          model: HirePrice,
        },
        {
          model: YearOfExperience,
        },
        {
          model: CandidateFile,
        },
        {
          model: CandidateImage,
        },
        {
          model: WorkExperience,
        },
        {
          model: CandidateInterview,
          required: false,
          where: {
            ...(dto.recruitment_requirement_id
              ? {
                  candidate_recruitment_id: {
                    [Op.in]: [
                      Sequelize.literal(
                        `SELECT id FROM candidate_recruitment WHERE recruitment_requirement_id = ${dto.recruitment_requirement_id}`,
                      ),
                    ],
                  },
                }
              : {}),
          },
        },
        {
          model: CandidateInformationFile,
        },
      ],
    };
    if (dto.recruitment_requirement_id) {
      options.attributes.include.push([
        this.sequelize.literal(
          `(
      SELECT status FROM candidate_recruitment
      WHERE candidate_information_id = ${id}
      AND recruitment_requirement_id = ${dto.recruitment_requirement_id}
      ORDER BY id DESC
      LIMIT 1
     )`,
        ),
        'candidate_recruitment_status',
      ]);
    }
    const candidates = await this.candidateInformationRepository.findOne(
      options,
    );

    let whereNextCondition: any = {
      id: { [Op.gt]: id },
    };
    let wherePreCondition: any = {
      id: { [Op.lt]: id },
    };
    if (dto.interest_status) {
      const interestList = await this.interestListRepository.findAll({
        where: {
          enterprise_id: enterprise.id,
          status: { [Op.in]: dto.interest_status.split(',') },
        },
      });
      const candidateIDs = interestList?.map((e) => e.candidate_information_id);
      whereNextCondition = {
        id: {
          [Op.and]: [
            {
              [Op.gt]: id,
            },
            {
              [Op.in]: candidateIDs,
            },
          ],
        },
      };
      wherePreCondition = {
        id: {
          [Op.and]: [
            {
              [Op.lt]: id,
            },
            {
              [Op.in]: candidateIDs,
            },
          ],
        },
      };
    }

    if (dto.recruitment_requirement_id) {
      const candidateRequirement =
        await this.candidateRecruitmentRepository.findAll({
          where: {
            recruitment_requirement_id: dto.recruitment_requirement_id,
          },
        });
      const candidateIDs = candidateRequirement?.map(
        (e) => e.candidate_information_id,
      );
      whereNextCondition = {
        id: {
          [Op.and]: [
            {
              [Op.gt]: id,
            },
            {
              [Op.in]: candidateIDs,
            },
          ],
        },
      };
      wherePreCondition = {
        id: {
          [Op.and]: [
            {
              [Op.lt]: id,
            },
            {
              [Op.in]: candidateIDs,
            },
          ],
        },
      };
    }

    const nextCandidate = await this.candidateInformationRepository.findOne({
      where: whereNextCondition,
      order: [['id', 'ASC']],
    });
    const preCandidate = await this.candidateInformationRepository.findOne({
      where: wherePreCondition,
      order: [['id', 'DESC']],
    });

    // Mapping thêm trường vào từng item trong candidateRecruitment
    const candidateArr = [candidates, nextCandidate, preCandidate];
    for (const elm of candidateArr) {
      if (!elm) continue; // Bỏ qua nếu elm là null hoặc undefined

      const foundCandidateRecruitment = await CandidateRecruitment.findOne({
        where: {
          candidate_information_id: elm.id,
          recruitment_requirement_id: dto?.recruitment_requirement_id,
        },
      });

      // Tìm kiếm các CandidateApply liên quan đến từng candidateRecruitment
      const candidateApplied = await CandidateApply.findOne({
        where: {
          candidate_recruitment_id: foundCandidateRecruitment?.id,
        },
        include: [
          {
            model: CandidateApplyFile,
          },
        ],
      });

      if (elm.dataValues) {
        elm.dataValues.candidate_applied = candidateApplied;
      }
    }

    return sendSuccess({
      data: {
        candidates,
        next_candidate: nextCandidate,
        pre_candidate: preCandidate,
      },
    });
  }

  async chooseCandidate(user_id: number, candidate_id: number) {
    const enterprise = await this.enterpriseRepository.findEnterprise(user_id);

    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const candidate = await this.candidateInformationRepository.findOne({
      where: { id: candidate_id },
      include: { model: User },
    });
    if (!candidate) {
      throw new HttpException(
        'Ứng viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    if (candidate.status == CANDIDATE_STATUS.CLOSE_CV) {
      throw new HttpException(
        'Ứng viên đã full công việc không tuyển được',
        HttpStatus.AMBIGUOUS,
      );
    }
    const professionalField =
      await this.professionalFieldRepository.findProfessionalField(
        candidate.professional_field_id,
      );

    if (!professionalField) {
      throw new HttpException(
        'Vị trí tuyển dụng không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    const hirePrice = await this.hirePriceRepository.findOne({
      where: {
        candidate_information_id: candidate.id,
      },
    });
    if (!hirePrice) {
      throw new HttpException(
        'Giá thuê không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const candidateJobType = await this.candidateJobTypeRepository.findOne({
      where: {
        candidate_information_id: candidate_id,
      },
    });
    if (!candidateJobType) {
      throw new HttpException(
        'Hình thức làm việc của ứng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const interestListFound = await this.interestListRepository.findOne({
      where: {
        candidate_information_id: candidate.id,
        enterprise_id: enterprise.id,
      },
    });
    if (interestListFound) {
      throw new HttpException(
        'Ứng viên đã được chọn cho doanh nghiệp này',
        HttpStatus.CONFLICT,
      );
    }
    const interestList = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        const payloadCreate = {
          candidate_information_id: candidate_id,
          enterprise_id: enterprise.id,
          professional_field_id: candidate.professional_field_id,
          hire_price: hirePrice.salary,
          status: INTEREST_LIST_STATUS.WAITING_APPROVE,
        };

        const interestList = await this.interestListRepository.create(
          payloadCreate,
          { transaction },
        );
        const candidateProvince =
          await this.candidateProvinceRepository.findAll({
            where: {
              candidate_information_id: candidate.id,
            },
          });
        if (candidateProvince && candidateProvince.length > 0) {
          const interestListProvinceCreated = candidateProvince.map((e) => ({
            interest_list_id: interestList?.id,
            df_province_id: e.df_province_id,
          }));
          await this.interestListProvinceRepository.bulkCreate(
            interestListProvinceCreated,
            { transaction },
          );
        }
        const candidateJobType = await this.candidateJobTypeRepository.findAll({
          where: {
            candidate_information_id: candidate.id,
          },
        });
        if (candidateJobType && candidateJobType.length > 0) {
          const interestListJobTypeCreated = candidateJobType.map((e) => ({
            interest_list_id: interestList?.id,
            job_type_id: e.job_type_id,
          }));
          await this.interestListJobTypeRepository.bulkCreate(
            interestListJobTypeCreated,
            { transaction },
          );
        }
        await this.interestListTransactionRepository.create({
          candidate_information_id: candidate_id,
          interest_list_id: interestList?.id,
          status: INTEREST_LIST_STATUS.WAITING_APPROVE,
          enterprise_id: enterprise.id,
        });
        return interestList;
      },
    );
    const notificationPayload: NotificationPayload = {
      title: 'Doanh nghiệp xác nhận chọn CV ứng viên ',
      content: `Ứng viên ${candidate.user.full_name} đang chờ xác nhận`,
      type: NOTIFICATION_TYPE.CHOOSE_CANDIDATE,
      data: { interest_list_id: interestList?.id },
    };
    this.notificationService.createAndSendNotificationForUsers(
      notificationPayload,
      {
        role_id: [ROLE.ADMIN],
      },
    );
    return sendSuccess({ data: interestList, msg: 'Chọn ứng viên thành công' });
  }
}
