//Nest dependencies
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
// Other dependencies
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
//Local files
import { AgeGroup } from '@models/age-group.model';
import { CandidateInformation } from '@models/candidate-information.model';
import { CandidateRecruitment } from '@models/candidate-recruitment.model';
import { DFProvince } from '@models/df-province.model';
import { Enterprise } from '@models/enterprise.model';
import { FeeOfRecruitmentRequirement } from '@models/fee-of-recruitment-requirement.model';
import { FeeType } from '@models/fee-type.model';
import { ProfessionalField } from '@models/professional-field.model';
import { RecruitmentJobType } from '@models/recruitment-job-type.model';
import { RecruitmentRequirementFile } from '@models/recruitment-requirement-file.model';
import { RecruitmentRequirementHistory } from '@models/recruitment-requirement-history.model';
import { RecruitmentRequirementHro } from '@models/recruitment-requirement-hro.model';
import { RecruitmentRequirementImplementation } from '@models/recruitment-requirement-implementation.model';
import { RecruitmentRequirementProvince } from '@models/recruitment-requirement-province.model';
import { SalaryRange } from '@models/salary-range.model';
import { User } from '@models/user.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { AgeGroupRepository } from '@repositories/age-group.repository';
import { CandidateInterviewRepository } from '@repositories/candidate-interview.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { FeeOfRecruitmentRequirementRepository } from '@repositories/fee-of-recruitment-requirement.repository';
import { GenderRepository } from '@repositories/gender.repository';
import { JobTypeRepository } from '@repositories/job-type.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { RecruitmentJobTypeRepository } from '@repositories/recruitment-job-type.repository';
import { RecruitmentRequirementFileRepository } from '@repositories/recruitment-requirement-file.repository';
import { RecruitmentRequirementHistoryRepository } from '@repositories/recruitment-requirement-history.repository';
import { RecruitmentRequirementHroRepository } from '@repositories/recruitment-requirement-hro.repository';
import { RecruitmentRequirementImplementationRepository } from '@repositories/recruitment-requirement-implementation.repository';
import { RecruitmentRequirementProvinceRepository } from '@repositories/recruitment-requirement-province.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { SalaryRangeRepository } from '@repositories/salary-range.repository';
import { UserRepository } from '@repositories/user.repository';
import { YearOfExperienceRepository } from '@repositories/year-of-experience.repository';
import { configService } from '@services/config.service';
import { MailService } from '@services/mail.service';
import { NotificationService } from '@services/notification.service';
import {
  APPLIED_FILE_TYPE,
  CANDIDATE_RECRUITMENT_STATUS,
  CANDIDATE_STATUS,
  CV_UPLOAD_STATUS,
  DEFAULT_PASSWORD,
  IS_ACTIVE,
  NOTIFICATION_TYPE,
  NotificationPayload,
  RECRUITMENT_STATUS,
  ROLE,
  TYPE_OF_FEE,
  USER_STATUS,
  WALLET_MUTABLE_TYPE,
  WALLET_REQUIREMENT_STATUS,
  WALLET_TYPE,
} from '@utils/constants';
import { createArrayObjectByKey } from '@utils/create-array-object-by-key';
import { convertDateTime } from '@utils/date-time';
import { generateUniqueWEPKey } from '@utils/generate-code-recruitment';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { EnterPriseAddressRepository } from '@repositories/enterprise-address.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import _ from 'lodash';
import {
  FilterAppliedRecruitmentDto,
  FilterRecruitmentFavoriteDto,
  RecruitmentIdDto,
} from '../dto/candidate-recruitment.dto';
import { DFCareerRepository } from '@repositories/df-career.repository';
import { UserRecruitmentFavoriteRepository } from '@repositories/user-recruitment-favorite.repository';
import { EnterpriseAddress } from '@models/enterprise-address.model';
import { ApplyRecruitmentDto } from '../dto/candidate-apply.dto';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateApplyRepository } from '@repositories/candidate-apply.repository';
import { CandidateApplyFileRepository } from '@repositories/candidate-apply-file.repository';
import { Position } from '@models/position.model';
import {
  ApplicationIdDto,
  ChangeCVNameDto,
  CreateApplicationDto,
  DeleteApplicationDto,
  EditApplicationNameDto,
  FileCVUpload,
  UpdateApplicationDto,
  updateCVFileDto,
  UpdateWorkExperienceDto,
} from '../dto/application.dto';
import { DFDegreeRepository } from '@repositories/df-degree.repository';
import { PositionRepository } from '@repositories/position.repository';
import { ApplicationRepository } from '@repositories/application.repository';
import { ApplicationProvinceRepository } from '@repositories/application-province.repository';
import { ApplicationCareerRepository } from '@repositories/application-career.repository';
import { WorkExperienceRepository } from '@repositories/work-experience.repository';
import { ApplicationJobTypeRepository } from '@repositories/application-job-type.repository';
import { DFDegree } from '@models/df-degree.model';
import { ApplicationCareer } from '@models/application-career.model';
import { ApplicationProvince } from '@models/application-province.model';
import { ApplicationJobType } from '@models/application-job-type.model';
import { WorkExperience } from '@models/work-experience.model';
import { JobType } from '@models/job-type.model';
import { JobTypeTime } from '@models/job-type-time.model';
import { JobTypeWorkplace } from '@models/job-type-workplace.model';
import { DFCareer } from '@models/df-career.model';
import { ApplicationCVRepository } from '@repositories/application-cv.repository';
import { RecruitmentRequirement } from '@models/recruitment-requirement.model';
import { CandidateFilterDetailWalletDto } from '../dto/filter-detail-wallet.dto';
import { WalletRequirementDto } from '../dto/wallet-requirement.dto';
import { WalletRequirementRepository } from '@repositories/wallet-requirement.repository';
import { DFBankRepository } from '@repositories/df-bank.repository';
import { Wallet } from '@models/wallet.model';
import { DFBank } from '@models/df-bank.model';
import { EducationExperienceRepository } from '@repositories/education-experience.repository';
import { SkillExperienceRepository } from '@repositories/skill-experience.repository';
import { Referrer } from '@models/referrer.model';
import { EducationExperience } from '@models/education-experience.model';
import { SkillExperience } from '@models/skill-experience.model';
import { ReferrerRepository } from '@repositories/referrer.repository';
import { Application } from '@models/application.model';
import { sendZaloMessage } from '@utils/send-zalo-message';
import { candidateAlreadyApplyTemplate } from 'src/shared/zalo-templates/templates';
import { ApplicationCV } from '@models/application-cv.model';
import { v4 as uuidv4 } from 'uuid';
import { CVUploaded } from '@models/cv-uploaded.model';
import { CandidateInterest } from '@models/candidate-interest.model';
import { CandidateInterestCareer } from '@models/candidate-interest-career.model';
import { TimelineStatus } from '@models/timeline-status.model';
import { CandidateApplyFile } from '@models/candidate-apply-file.model';
import { DFWard } from '@models/df-ward.model';
import { DFDistrict } from '@models/df-district.model';
import { CandidateApply } from '@models/candidate-apply.model';
import { FilterApplicationDto } from 'src/v1/candidate/features/recruitment/dto/candidate-recruitment.dto';
@Injectable()
export class MiniAppCandidateService {
  constructor(
    private readonly recruitmentRequirementRepository: RecruitmentRequirementRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly notificationService: NotificationService,
    private readonly professionalFieldRepository: ProfessionalFieldRepository,
    private readonly jobTypeRepository: JobTypeRepository,
    private readonly dfProvinceRepository: DFProvinceRepository,
    private readonly yearOfExperienceRepository: YearOfExperienceRepository,
    private readonly genderRepository: GenderRepository,
    private readonly ageGroupRepository: AgeGroupRepository,
    private readonly salaryRangeRepository: SalaryRangeRepository,
    private readonly recruitmentJobTypeRepository: RecruitmentJobTypeRepository,
    private readonly feeOfRecruitmentRequirementRepository: FeeOfRecruitmentRequirementRepository,
    private readonly recruitmentRequirementHistoryRepository: RecruitmentRequirementHistoryRepository,
    private readonly recruitmentRequirementProvinceRepository: RecruitmentRequirementProvinceRepository,
    private readonly candidateInterviewRepository: CandidateInterviewRepository,
    private readonly candidateRecruitmentRepository: CandidateRecruitmentRepository,
    private readonly recruitmentRequirementImplementationRepository: RecruitmentRequirementImplementationRepository,
    private readonly recruitmentRequirementFileRepository: RecruitmentRequirementFileRepository,
    private readonly recruitmentRequirementHroRepository: RecruitmentRequirementHroRepository,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly sequelize: Sequelize,
    private readonly walletRepository: WalletRepository,
    private readonly walletHistoryRepository: WalletHistoryRepository,
    private readonly enterPriseAddressRepository: EnterPriseAddressRepository,
    private readonly candidateInformationRepository: CandidateInformationRepository,
    private readonly userRecruitmentFavoriteRepository: UserRecruitmentFavoriteRepository,
    private readonly candidateApplyRepository: CandidateApplyRepository,
    private readonly candidateApplyFileRepository: CandidateApplyFileRepository,
    private readonly dfDegreeRepository: DFDegreeRepository,
    private readonly positionRepository: PositionRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly applicationProvinceRepository: ApplicationProvinceRepository,
    private readonly applicationCareerRepository: ApplicationCareerRepository,
    private readonly applicationJobTypeRepository: ApplicationJobTypeRepository,
    private readonly workExperienceRepository: WorkExperienceRepository,
    private readonly applicationCVRepository: ApplicationCVRepository,
    private readonly walletRequirementRepository: WalletRequirementRepository,
    private readonly dfBankRepository: DFBankRepository,
    private readonly educationExperienceRepository: EducationExperienceRepository,
    private readonly skillExperienceRepository: SkillExperienceRepository,
    private readonly referrerRepository: ReferrerRepository,
  ) {}

  async handleFavoriteRecruitmentRequirement(
    user_id: number,
    dto: RecruitmentIdDto,
  ) {
    const foundRecruimentRequirement =
      await this.recruitmentRequirementRepository.findOne({
        where: {
          id: dto.recruitment_requirement_id,
        },
      });

    if (!foundRecruimentRequirement) {
      throw new HttpException(
        'Tin tuyển dụng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    let result = null;
    if (dto.is_favorite) {
      result = await this.userRecruitmentFavoriteRepository.create({
        user_id,
        recruitment_requirement_id: dto.recruitment_requirement_id,
      });
    } else {
      await this.userRecruitmentFavoriteRepository.destroy({
        where: {
          user_id,
          recruitment_requirement_id: dto.recruitment_requirement_id,
        },
      });
    }

    return sendSuccess({ data: result });
  }

  async getMyRecruitmentFavorites(
    user_id: number,
    dto: FilterRecruitmentFavoriteDto,
  ) {
    const recruitmentFavorites =
      await this.userRecruitmentFavoriteRepository.findAll({
        where: {
          user_id,
        },
      });
    const recruitmentFavoriteIds = recruitmentFavorites?.map(
      (elm) => elm.recruitment_requirement_id,
    );

    const whereCondition: any = {
      [Op.and]: [
        {
          id: {
            [Op.in]: recruitmentFavoriteIds,
          },
        },
      ],
    };

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }

    const includeCountOptions: any = [
      {
        model: Enterprise,
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'status', 'avatar'],
            as: 'user',
          },
        ],
      },
    ];
    const includeOptions: any = [
      {
        model: Enterprise,
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'status', 'avatar'],
            as: 'user',
          },
          {
            model: EnterpriseAddress,
            attributes: [
              'id',
              'df_province_id',
              'df_district_id',
              'df_ward_id',
              'address',
              'name',
            ],
            include: {
              model: DFProvince,
              attributes: ['id', 'name'],
            },
          },
        ],
      },
      {
        model: ProfessionalField,
      },
      {
        model: Position,
      },
      { model: RecruitmentRequirementFile },
      { model: SalaryRange },
    ];

    let provinceDataInclude: any = {
      model: RecruitmentRequirementProvince,
      as: 'recruitment_requirement_province',
    };

    if (dto.province_ids) {
      const provinceIdsArray: any = dto.province_ids
        .split(',')
        .map((id) => parseInt(id));
      const conditionProvince = {
        '$recruitment_requirement_province.df_province_id$': {
          [Op.in]: provinceIdsArray,
        },
      };
      provinceDataInclude = {
        model: RecruitmentRequirementProvince,
        as: 'recruitment_requirement_province',
        where: conditionProvince,
      };
    }
    includeCountOptions.push(provinceDataInclude);
    includeOptions.push(provinceDataInclude);

    const options: any = {
      where: whereCondition,
      attributes: {
        include: [],
      },
      include: includeOptions,
      order: ['status', ['updated_at', 'DESC']],
    };
    const countOptions: any = {
      where: whereCondition,
    };

    dto.province_ids ? (countOptions.include = includeCountOptions) : '';

    const count = await this.recruitmentRequirementRepository.count(
      countOptions,
    );

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const recruitments: any =
      await this.recruitmentRequirementRepository.findAll(options);

    // Tìm các tin tuyển dụng đã apply
    const foundCandidateInformation: any =
      await this.candidateInformationRepository.findOne({
        where: {
          user_id,
        },
        attributes: ['id', 'user_id'],
      });

    const foundApplyRecruitments =
      await this.candidateRecruitmentRepository.findAll({
        where: {
          candidate_information_id: foundCandidateInformation?.id,
        },
        attributes: [
          'id',
          'candidate_information_id',
          'recruitment_requirement_id',
        ],
      });
    const applyRecruitmentsIds = foundApplyRecruitments?.map(
      (elm) => elm.recruitment_requirement_id,
    );

    //Maping các tin đã thích + các tin tuyển dụng đã ứng tuyển (đối với ứng viên)
    for (const recruitment of recruitments) {
      recruitment.dataValues.is_favorite = true;
      if (applyRecruitmentsIds?.includes(recruitment.id)) {
        recruitment.dataValues.is_applied = true;
      } else {
        recruitment.dataValues.is_applied = false;
      }
    }

    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({
      data: recruitments,
      blocks: {
        status: RECRUITMENT_STATUS,
      },
      paging,
    });
  }

  async getAppliedRecruitment(
    user_id: number,
    dto: FilterAppliedRecruitmentDto,
  ) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      include: [
        {
          model: CandidateInformation,
          as: 'candidate_information',
        },
      ],
    });

    if (!foundUser || !foundUser.candidate_information.id) {
      throw new HttpException(
        'Người dùng (Ứng viên/Cộng tác viên) không tồn tại trên hệ thống',
        HttpStatus.FOUND,
      );
    }
    const appliedRecruitments =
      await this.candidateRecruitmentRepository.findAll({
        where: {
          candidate_information_id: foundUser.candidate_information.id,
          status: {
            [Op.ne]: CANDIDATE_RECRUITMENT_STATUS.PENDING_CV,
          },
        },
      });
    let appliedRecruitmentIds = appliedRecruitments?.map(
      (elm) => elm.recruitment_requirement_id,
    );

    if (dto.candidate_recruitment_statuses) {
      const statusArray: any = dto.candidate_recruitment_statuses
        ?.split(',')
        .map((id) => parseInt(id));

      const foundCandidateRecruiments = await CandidateRecruitment.findAll({
        where: {
          status: {
            [Op.in]: statusArray,
          },
          candidate_information_id: foundUser.candidate_information.id,
        },
      });

      const idsArray: any = foundCandidateRecruiments.map(
        (elm) => elm?.recruitment_requirement_id,
      );

      appliedRecruitmentIds = idsArray;
    }

    const whereCondition: any = {
      [Op.and]: [
        {
          id: {
            [Op.in]: appliedRecruitmentIds,
          },
        },
      ],
    };

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }

    const includeCountOptions: any = [
      {
        model: Enterprise,
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'status', 'avatar'],
            as: 'user',
          },
        ],
      },
    ];
    const includeOptions: any = [
      {
        model: Enterprise,
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'status', 'avatar'],
            as: 'user',
          },
          {
            model: EnterpriseAddress,
            attributes: [
              'id',
              'df_province_id',
              'df_district_id',
              'df_ward_id',
              'address',
              'name',
            ],
            include: {
              model: DFProvince,
              attributes: ['id', 'name'],
            },
          },
        ],
      },
      {
        model: ProfessionalField,
      },
      {
        model: Position,
      },
      { model: RecruitmentRequirementFile },
      { model: SalaryRange },
    ];

    let provinceDataInclude: any = {
      model: RecruitmentRequirementProvince,
      as: 'recruitment_requirement_province',
    };

    if (dto.province_ids) {
      const provinceIdsArray: any = dto.province_ids
        .split(',')
        .map((id) => parseInt(id));
      const conditionProvince = {
        '$recruitment_requirement_province.df_province_id$': {
          [Op.in]: provinceIdsArray,
        },
      };
      provinceDataInclude = {
        model: RecruitmentRequirementProvince,
        as: 'recruitment_requirement_province',
        where: conditionProvince,
      };
    }
    includeCountOptions.push(provinceDataInclude);
    includeOptions.push(provinceDataInclude);

    const options: any = {
      where: whereCondition,
      attributes: {
        include: [],
      },
      include: includeOptions,
      order: ['status', ['updated_at', 'DESC']],
    };
    const countOptions: any = {
      where: whereCondition,
    };

    dto.province_ids ? (countOptions.include = includeCountOptions) : '';

    const count = await this.recruitmentRequirementRepository.count(
      countOptions,
    );

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const recruitments: any =
      await this.recruitmentRequirementRepository.findAll(options);

    for (const recruitment of recruitments) {
      recruitment.dataValues.is_applied = true;

      const foundCandidateRecruitments: any =
        await CandidateRecruitment.findAll({
          where: {
            candidate_information_id: foundUser.candidate_information.id,
            recruitment_requirement_id: recruitment.id,
            status: {
              [Op.ne]: CANDIDATE_RECRUITMENT_STATUS.PENDING_CV,
            },
          },
          include: [
            {
              model: CandidateApply,
              include: [
                {
                  model: CandidateApplyFile,
                },
              ],
            },
          ],
        });

      if (foundCandidateRecruitments?.length === 1) {
        recruitment.dataValues.apply_status =
          foundCandidateRecruitments[0].status;
        recruitment.dataValues.apply_files_count =
          foundCandidateRecruitments[0].candidate_apply.candidate_apply_file.length;
      } else if (foundCandidateRecruitments?.length > 1) {
        recruitment.dataValues.apply_status = null;
        recruitment.dataValues.apply_files_count =
          foundCandidateRecruitments.reduce((count: any, item: any) => {
            const filesCount =
              item.candidate_apply?.candidate_apply_file?.length || 0;
            return count + filesCount;
          }, 0);
      }
    }

    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({
      data: recruitments,
      blocks: {
        recruitment_status: RECRUITMENT_STATUS,
        candidate_recruitment_status: CANDIDATE_RECRUITMENT_STATUS,
      },
      paging,
    });
  }

  async detailAppliedRecruitment(id: number, user_id?: number) {
    const foundCandidateInformation = await CandidateInformation.findOne({
      where: {
        user_id,
      },
    });
    const recruitment: any =
      await this.recruitmentRequirementRepository.findOne({
        where: {
          id,
        },
        include: [
          { model: ProfessionalField },
          { model: Position },
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
            model: CandidateRecruitment,
            include: [
              {
                model: CandidateInformation,
                as: 'candidate_information',
                include: [{ model: User }],
              },
              {
                model: User,
                attributes: [
                  'avatar',
                  'role_id',
                  'full_name',
                  'email',
                  'phone_number',
                ],
              },
            ],
          },
          {
            model: RecruitmentRequirementHistory,
            attributes: {
              include: [
                [
                  Sequelize.literal(
                    `(
                  SELECT JSON_OBJECT('full_name',full_name,'phone_number', phone_number) FROM candidate_information JOIN user ON user.id = candidate_information.user_id
                  WHERE candidate_information.id = recruitment_requirement_history.candidate_information_id
                  LIMIT 1
                )`,
                  ),
                  'candidate_information',
                ],
              ],
            },
            include: [
              {
                model: User,
                attributes: [
                  'id',
                  'full_name',
                  'role_id',
                  'avatar',
                  'phone_number',
                  [
                    Sequelize.literal(
                      `(
                      SELECT name FROM enterprise
                      WHERE user_id = recruitment_requirement_history.created_by
                      LIMIT 1
                     )`,
                    ),
                    'enterprise_name',
                  ],
                ],
              },
            ],
          },
          {
            model: RecruitmentJobType,
            attributes: {
              include: [
                [
                  Sequelize.literal(
                    `(
                    SELECT name FROM job_type
                    WHERE id = recruitment_job_type.job_type_id
                    LIMIT 1
                   )`,
                  ),
                  'job_type_name',
                ],
              ],
            },
          },
          { model: User, attributes: ['id', 'full_name'] },
          {
            model: RecruitmentRequirementImplementation,
            attributes: {
              include: [
                [
                  Sequelize.literal(
                    `(
                    SELECT COUNT(id) FROM candidate_recruitment
                    WHERE deleted_at IS NULL AND created_by = recruitment_requirement_implementation.user_id
                    AND recruitment_requirement_id = ${id}
                    LIMIT 1
                   )`,
                  ),
                  'candidate_count',
                ],
              ],
            },
            include: [
              {
                model: User,
                attributes: ['id', 'full_name', 'phone_number', 'email'],
              },
            ],
          },
          {
            model: RecruitmentRequirementHro,
            include: [{ model: User, attributes: ['id', 'full_name'] }],
            attributes: {
              include: [
                [
                  Sequelize.literal(
                    `(
                    SELECT IF(COUNT(candidate_recruitment.id)>0,1,0) FROM candidate_recruitment 
                    JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
                    WHERE recruitment_requirement_id = ${id} AND candidate_information.created_by = recruitment_requirement_hro.user_id
                    AND candidate_recruitment.deleted_at IS NULL
                    LIMIT 1
                   )`,
                  ),
                  'has_candidate',
                ],
              ],
            },
          },
        ],
        attributes: {
          include: [
            [
              this.sequelize.literal(
                `(
            SELECT COUNT(id) FROM candidate_recruitment
            WHERE recruitment_requirement_id = ${id}
            LIMIT 1
           )`,
              ),
              'candidate_count',
            ],
          ],
        },
      });

    const foundCandidateRequirement =
      await this.candidateRecruitmentRepository.findAll({
        where: {
          candidate_information_id: foundCandidateInformation?.id,
          recruitment_requirement_id: recruitment?.id,
        },
      });

    let files_applied: any = null;

    if (foundCandidateRequirement) {
      const foundCandidateApply = await this.candidateApplyRepository.findAll({
        where: {
          candidate_information_id: foundCandidateInformation?.id,
          candidate_recruitment_id: foundCandidateRequirement?.map(
            (elm) => elm.id,
          ),
        },
        include: [
          {
            model: CandidateRecruitment,
            include: [
              {
                model: CandidateInformation,
                as: 'candidate_information_review',
              },
            ],
          },
          {
            model: CandidateApplyFile,
          },
        ],
      });
      files_applied = foundCandidateApply?.filter(
        (elm) =>
          elm.candidate_recruitment.status !==
          CANDIDATE_RECRUITMENT_STATUS.PENDING_CV,
      );
    }
    recruitment.dataValues.cv_files_applied = files_applied;

    return sendSuccess({
      data: recruitment,
      blocks: {
        recruitment_status: RECRUITMENT_STATUS,
        candidate_recruitment_status: CANDIDATE_RECRUITMENT_STATUS,
      },
    });
  }

  async detailTimelineStatus(id: number, user_id?: number) {
    const foundCandidateApply = await this.candidateApplyRepository.findAll({
      where: {
        id,
      },
      include: [
        {
          model: CandidateRecruitment,
          include: [
            {
              model: TimelineStatus,
            },
          ],
        },
        {
          model: CandidateApplyFile,
        },
      ],
    });

    return sendSuccess({
      data: foundCandidateApply,
      blocks: {
        recruitment_status: RECRUITMENT_STATUS,
        candidate_recruitment_status: CANDIDATE_RECRUITMENT_STATUS,
      },
    });
  }

  async applyRecruitment(user_id: number, dto: ApplyRecruitmentDto) {
    //Check chặn nếu không tải file CV ứng tuyển lên
    if (dto?.cv_files.length === 0) {
      throw new HttpException(
        'Vui lòng chọn CV ứng tuyển',
        HttpStatus.BAD_REQUEST,
      );
    }

    const foundRecruimentRequirement =
      await this.recruitmentRequirementRepository.findOne({
        where: {
          id: dto.recruitment_requirement_id,
        },
      });

    if (!foundRecruimentRequirement) {
      throw new HttpException(
        'Tin tuyển dụng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const foundCandidateInformation =
      await this.candidateInformationRepository.findOne({
        where: {
          id: dto.candidate_information_id,
        },
      });

    if (!foundCandidateInformation) {
      throw new HttpException(
        'Thông tin ứng viên/cộng tác viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        //Tạo liên kết ứng viên & job/tin tuyển dụng
        const createdCandidateRecruitment =
          await this.candidateRecruitmentRepository.create(
            {
              recruitment_requirement_id: dto.recruitment_requirement_id,
              candidate_information_id: dto.candidate_information_id,
              status: CANDIDATE_RECRUITMENT_STATUS.PENDING,
              created_by: user_id,
            },
            { transaction },
          );

        const payloadCreate = {
          candidate_information_id: dto.candidate_information_id,
          candidate_recruitment_id: createdCandidateRecruitment?.id,
          created_by: user_id,
        };

        const candidateApply: any = await this.candidateApplyRepository.create(
          payloadCreate,
          { transaction },
        );

        let candidate_info_review_id = null;
        const foundEnterpise = await Enterprise.findOne({
          where: {
            id: foundRecruimentRequirement.enterprise_id,
          },
        });
        if (dto.upload_from_device && dto.cv_files && dto.cv_files.length > 0) {
          const dataCreated = dto.cv_files.map((e) => ({
            candidate_apply_id: candidateApply.id,
            file: e.file,
            file_name: e.file_name,
            created_by: user_id,
            type: APPLIED_FILE_TYPE.FROM_DEVICE,
          }));

          await this.candidateApplyFileRepository.bulkCreate(dataCreated, {
            transaction,
          });
          //Clone candidate (status: PENDING - 3 (CANDIDATE_STATUS))
          const { created_at, updated_at, ...userData }: any =
            await this.userRepository.findOne({
              where: {
                id: user_id,
              },
            });

          const payloadCreate = {
            gender_id: userData.dataValues.gender_id,
            role_id: ROLE.CANDIDATE, // CTV,UV đều clone tạo tk thuộc loại ứng viên
            full_name: userData.dataValues.full_name,
            email: userData.dataValues.email,
            phone_number: userData.dataValues.phone_number,
            password: userData.dataValues.password,
            alternate_phone: userData.dataValues.alternate_phone,
            avatar: userData.dataValues.avatar,
            date_of_birth: userData.dataValues.date_of_birth,
            status: userData.dataValues.status,
            is_save_searching: userData.dataValues.is_save_searching || 0,
          };

          const clonedUser = await this.userRepository.create(payloadCreate, {
            transaction,
          });

          let cloneCandidateInformation: any = null;
          if (clonedUser) {
            const {
              id,
              created_at,
              updated_at,
              status,
              ...candidateInforData
            }: any = await this.candidateInformationRepository.findOne({
              where: {
                user_id,
              },
            });

            const payloadCreateCandidateInfor = {
              user_id: clonedUser.id,
              years_of_experience_id:
                foundCandidateInformation.dataValues.years_of_experience_id,
              position_id: foundCandidateInformation.dataValues.position_id,
              degree_id: foundCandidateInformation.dataValues.degree_id,
              professional_field_id:
                foundCandidateInformation.dataValues.professional_field_id,
              professional_field:
                foundCandidateInformation.dataValues.professional_field,
              is_all_province:
                foundCandidateInformation.dataValues.is_all_province,
              salary_range_id:
                foundCandidateInformation.dataValues.salary_range_id,
              note: foundCandidateInformation.dataValues.note,
              skill_input: foundCandidateInformation.dataValues.skill_input,
              is_recruitment:
                foundCandidateInformation.dataValues.is_recruitment,
              created_by: foundCandidateInformation.dataValues.created_by,
              is_hire: foundCandidateInformation.dataValues.is_hire,
              type_on_call: foundCandidateInformation.dataValues.type_on_call,
              type_on_hour: foundCandidateInformation.dataValues.type_on_hour,
              budget_min: foundCandidateInformation.dataValues.budget_min,
              budget_max: foundCandidateInformation.dataValues.budget_max,
            };

            cloneCandidateInformation =
              await this.candidateInformationRepository.create(
                {
                  ...payloadCreateCandidateInfor,
                  status: CANDIDATE_STATUS.PENDING,
                },
                { transaction },
              );

            candidate_info_review_id = cloneCandidateInformation.id;
            //clone bằng cấp cao nhất, số năm kinh nghiệm , vị trí chức vụ mong muốn, mức lương mong muốn của ứng viên (nếu có)
            const foundCandidateInterest: any = await CandidateInterest.findOne(
              {
                where: {
                  candidate_information_id: foundCandidateInformation.id,
                },
              },
            );
            const payloadCreateCandidateInterest = {
              candidate_information_id: cloneCandidateInformation.id,
              df_degree_id: foundCandidateInterest?.degree_id,
              year_of_experience_id:
                foundCandidateInterest?.year_of_experience_id,
              position_id: foundCandidateInterest?.position_id,
              salary_range_id: foundCandidateInterest?.salary_range_id,
            };
            const cloneCandidateInterest = await CandidateInterest.create(
              payloadCreateCandidateInterest,
              {
                transaction,
              },
            );
            //Clone nghề nghiệp quan tâm
            const foundAllCareerInterests =
              await CandidateInterestCareer.findAll({
                where: {
                  candidate_interest_id: foundCandidateInterest.id,
                },
              });
            const careerListCreated = foundAllCareerInterests.map((e: any) => ({
              candidate_interest_id: cloneCandidateInterest?.id,
              df_career_id: e.df_career_id,
            }));

            await CandidateInterestCareer.bulkCreate(careerListCreated, {
              transaction,
            });
          }

          //Lưu thông tin cv từ máy
          const dataCVFromDeviceCreated = dto.cv_files.map((e) => ({
            file: e.file,
            file_name: e.file_name,
            created_by: user_id,
            status: CV_UPLOAD_STATUS.PENDING,
            candidate_information_id: foundCandidateInformation.id,
            candidate_info_review_id: cloneCandidateInformation.id,
            is_main: 0,
          }));

          await CVUploaded.bulkCreate(dataCVFromDeviceCreated, {
            transaction,
          });
          //Cập nhật lại candidate_info_review_id vào candidate-recruitment
          await CandidateRecruitment.update(
            {
              candidate_info_review_id: cloneCandidateInformation.id,
              status: CANDIDATE_RECRUITMENT_STATUS.PENDING_CV,
            },
            {
              where: {
                id: createdCandidateRecruitment?.id,
              },
              transaction,
            },
          );

          //Gửi thông báo tới Admin
          const notificationPayload: NotificationPayload = {
            title: `Ứng viên ${userData.dataValues.full_name} đã ứng tuyển vào yêu cầu tuyển dụng ${foundRecruimentRequirement.code} của ${foundEnterpise?.name} và đang chờ duyệt.`,
            content: `Ứng viên ${userData.dataValues.full_name} đã ứng tuyển vào yêu cầu tuyển dụng ${foundRecruimentRequirement.code} của ${foundEnterpise?.name} và đang chờ duyệt.`,
            type: NOTIFICATION_TYPE.NEW_APPLICATION_TO_APPROVE,
            data: {
              user_id: clonedUser?.id,
              candidate_information_id: cloneCandidateInformation?.id,
              notification_type: NOTIFICATION_TYPE.NEW_APPLICATION_TO_APPROVE,
            },
          };
          this.notificationService.createAndSendNotificationForUsers(
            notificationPayload,
            {
              role_id: [ROLE.ADMIN],
            },
          );
        } else if (
          !dto.upload_from_device &&
          dto.cv_files &&
          dto.cv_files.length > 0
        ) {
          const dataCreated = dto.cv_files.map((e) => ({
            candidate_apply_id: candidateApply.id,
            file: e.file,
            file_name: e.file_name,
            created_by: user_id,
            type: dto.uploaded_before
              ? APPLIED_FILE_TYPE.FROM_DEVICE
              : APPLIED_FILE_TYPE.FROM_APPLICATION,
          }));

          await this.candidateApplyFileRepository.bulkCreate(dataCreated, {
            transaction,
          });

          //Gửi thông báo tới Admin
          const foundUserApply: any = await this.userRepository.findOne({
            where: {
              id: user_id,
            },
            include: [
              {
                model: CandidateInformation,
              },
            ],
          });
          const notificationPayload: NotificationPayload = {
            title: `Ứng viên ${foundUserApply.dataValues.full_name} đã ứng tuyển vào yêu cầu tuyển dụng ${foundRecruimentRequirement.code} của ${foundEnterpise?.name} và đang chờ duyệt.`,
            content: `Ứng viên ${foundUserApply.dataValues.full_name} đã ứng tuyển vào yêu cầu tuyển dụng ${foundRecruimentRequirement.code} của ${foundEnterpise?.name} và đang chờ duyệt.`,
            type: NOTIFICATION_TYPE.NEW_APPLICATION_TO_APPROVE,
            data: {
              user_id,
              candidate_information_id:
                foundUserApply?.candidate_information?.id,
              notification_type: NOTIFICATION_TYPE.NEW_APPLICATION_TO_APPROVE,
            },
          };
          this.notificationService.createAndSendNotificationForUsers(
            notificationPayload,
            {
              role_id: [ROLE.ADMIN],
            },
          );
        }

        //Cập nhật timeline trạng thái
        await TimelineStatus.create(
          {
            candidate_recruitment_id: createdCandidateRecruitment?.id,
            candidate_information_id:
              createdCandidateRecruitment?.candidate_information_id,
            candidate_info_review_id: candidate_info_review_id,
            status: CANDIDATE_RECRUITMENT_STATUS.PENDING,
            modify_date: new Date(),
          },
          { transaction },
        );

        return createdCandidateRecruitment;
      },
    );
    //Gửi tin nhắn zalo tới HR (người đã tạo tin tuyển dụng)
    const foundHr = await this.userRepository.findOne({
      where: {
        id: foundRecruimentRequirement.created_by,
      },
    });
    if (foundHr && foundHr?.phone_number) {
      const message = candidateAlreadyApplyTemplate(
        foundHr.full_name,
        foundRecruimentRequirement.position_input,
        'https://zalo.me/s/1312390836269348201/list-candi?type=1',
      );
      await sendZaloMessage({
        messages: [
          {
            phone: foundHr?.phone_number,
            name: foundHr?.full_name,
            message: message,
          },
        ],
      });
    }
    return sendSuccess({ data: result, msg: 'Ứng tuyển thành công' });
  }

  //Xử lí Hồ sơ ứng viên (tạo mới hoặc cập nhật nếu đã có)
  async handleApplication(user_id: number, dto: CreateApplicationDto) {
    const foundCandidate = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      include: [
        {
          model: CandidateInformation,
          as: 'candidate_information',
          attributes: ['id', 'user_id'],
        },
      ],
    });

    if (!foundCandidate || !foundCandidate?.candidate_information?.id) {
      throw new HttpException(
        'Ứng viên/Cộng tác viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const foundApplication = await this.applicationRepository.findOne({
      where: {
        candidate_information_id: foundCandidate?.candidate_information?.id,
        is_main: 1,
      },
    });

    if (dto.job_type_ids) {
      const jobType: any = await this.jobTypeRepository.foundJobType(
        dto.job_type_ids,
      );
      if (!Array.isArray(jobType) && jobType.length === 0) {
        throw new HttpException(
          'Hình thức làm việc không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto.is_all_province == IS_ACTIVE.ACTIVE) {
      if (dto.province_ids && dto.province_ids.length > 0) {
        throw new HttpException(
          'Vui lòng không chọn khu vực làm việc ',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (dto.province_ids && dto.province_ids.length > 0) {
      const province = await this.dfProvinceRepository.findAll({
        where: {
          id: { [Op.in]: dto.province_ids },
        },
      });
      if (province?.length != dto.province_ids.length) {
        throw new HttpException(
          'Khu vực làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.year_of_experience_id) {
      const yearsOfExperience =
        await this.yearOfExperienceRepository.findYearOfExperience(
          dto.year_of_experience_id,
        );
      if (!yearsOfExperience) {
        throw new HttpException(
          'Kinh nghiệm làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto.degree_id) {
      const degree = await this.dfDegreeRepository.findOne({
        where: {
          id: dto.degree_id,
        },
      });
      if (!degree) {
        throw new HttpException(
          'Bằng cấp không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto?.position_id) {
      const foundPosition = await this.positionRepository.findOne({
        where: {
          id: dto?.position_id,
        },
      });

      if (!foundPosition) {
        throw new HttpException(
          'Vị trí tuyển dụng không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto.gender_id) {
      const gender = await this.genderRepository.findGender(dto.gender_id);
      if (!gender) {
        throw new HttpException(
          'Giới tính không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    let salaryRange: null | SalaryRange = null;
    if (dto.salary_range_id) {
      salaryRange = await this.salaryRangeRepository.findSalaryRange(
        dto.salary_range_id,
      );
      if (!salaryRange) {
        throw new HttpException(
          'Mức lương không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    let result: any = null;
    if (!foundApplication) {
      // Nếu chưa có hồ sơ -> tạo mới
      result = await this.sequelize.transaction(
        async (transaction: Transaction) => {
          const payloadCreate = {
            avatar: dto?.avatar || null,
            full_name: dto?.full_name || null,
            phone_number: dto?.phone_number || null,
            email: dto?.email || null,
            gender_id: dto?.gender_id || null,
            address: dto?.address || null,
            education: dto?.education || null,
            skill_input: dto?.skill_input || null,
            career_goals: dto?.career_goals || null,
            position_input: dto?.position_input || null,
            date_of_birth: dto?.date_of_birth || null,
            candidate_information_id: foundCandidate.candidate_information.id,
            year_of_experience_id: +dto.year_of_experience_id || null,
            salary_range_id: salaryRange ? +dto.salary_range_id : null,
            degree_id: dto.degree_id || null,
            is_all_province: dto.is_all_province,
            position_id: dto.position_id || null,
            is_main: 1,
          };

          const application: any = await this.applicationRepository.create(
            payloadCreate,
            {
              transaction,
            },
          );
          if (dto.province_ids && dto.province_ids.length > 0) {
            const created = dto.province_ids.map((e) => ({
              application_id: application?.id,
              df_province_id: e,
            }));
            await this.applicationProvinceRepository.bulkCreate(created, {
              transaction,
            });
          }

          //Tạo ngành nghề quan tâm
          if (dto.career_ids && dto.career_ids.length > 0) {
            const careerListCreated = dto.career_ids.map((e: any) => ({
              application_id: application?.id,
              df_career_id: e,
            }));
            await this.applicationCareerRepository.bulkCreate(
              careerListCreated,
              {
                transaction,
              },
            );
          }

          //Tạo hình thức làm việc
          if (dto.job_type_ids && dto.job_type_ids.length > 0) {
            const jobTypeListCreated = dto.job_type_ids.map((e: any) => ({
              application_id: application?.id,
              job_type_id: e,
            }));
            await this.applicationJobTypeRepository.bulkCreate(
              jobTypeListCreated,
              {
                transaction,
              },
            );
          }

          if (dto.work_experiences && dto.work_experiences.length > 0) {
            const workExperience = dto.work_experiences.map((e) => ({
              application_id: application?.id,
              enterprise_name: e.enterprise_name,
              position: e.position,
              start_time: e.start_time,
              end_time: e.end_time,
              description: e.description,
            }));
            await this.workExperienceRepository.bulkCreate(workExperience, {
              transaction,
            });
          }

          if (
            dto.education_experiences &&
            dto.education_experiences.length > 0
          ) {
            const educationExperience = dto.education_experiences.map((e) => ({
              application_id: application?.id,
              candidate_information_id: foundCandidate.candidate_information.id,
              school_name: e.school_name,
              major: e.major,
              start_time: e.start_time,
              end_time: e.end_time,
              description: e.description,
            }));
            await this.educationExperienceRepository.bulkCreate(
              educationExperience,
              {
                transaction,
              },
            );
          }

          if (dto.skill_experiences && dto.skill_experiences.length > 0) {
            const skillExperience = dto.skill_experiences.map((e) => ({
              application_id: application?.id,
              candidate_information_id: foundCandidate.candidate_information.id,
              skill_name: e.skill_name,
              rating: e.rating,
              description: e.description,
            }));
            await this.skillExperienceRepository.bulkCreate(skillExperience, {
              transaction,
            });
          }

          if (dto.referrer) {
            await this.referrerRepository.create(
              {
                application_id: application?.id,
                full_name: dto?.referrer?.full_name || null,
                phone_number: dto?.referrer?.phone_number || null,
                email: dto?.referrer?.email || null,
                position_input: dto?.referrer?.position_input || null,
              },
              {
                transaction,
              },
            );
          }

          return application;
        },
      );
    } else {
      // Nếu đã có hồ sơ -> cập nhật
      result = await this.sequelize.transaction(
        async (transaction: Transaction) => {
          const payloadUpdate = {
            avatar: dto?.avatar || null,
            full_name: dto?.full_name || null,
            phone_number: dto?.phone_number || null,
            email: dto?.email || null,
            address: dto?.address || null,
            education: dto?.education || null,
            gender_id: dto?.gender_id || null,
            skill_input: dto?.skill_input || null,
            career_goals: dto?.career_goals || null,
            position_input: dto?.position_input || null,
            date_of_birth: dto?.date_of_birth || null,
            year_of_experience_id: +dto.year_of_experience_id || null,
            salary_range_id: salaryRange ? +dto.salary_range_id : null,
            degree_id: dto.degree_id || null,
            is_all_province: dto.is_all_province,
            position_id: dto.position_id || null,
          };

          await this.applicationRepository.update(payloadUpdate, {
            where: {
              id: foundApplication.id,
            },
            transaction,
          });
          if (dto.province_ids && dto.province_ids.length > 0) {
            //Xoá các địa chỉ hồ sơ cũ
            await this.applicationProvinceRepository.update(
              {
                deleted_at: new Date(),
              },
              {
                where: {
                  application_id: foundApplication?.id,
                },
                transaction,
              },
            );

            const created = dto.province_ids.map((e) => ({
              application_id: foundApplication?.id,
              df_province_id: e,
            }));
            await this.applicationProvinceRepository.bulkCreate(created, {
              transaction,
            });
          }

          //Tạo ngành nghề quan tâm
          if (dto.career_ids && dto.career_ids.length > 0) {
            //Xoá các nghành nghề hồ sơ cũ
            await this.applicationCareerRepository.update(
              {
                deleted_at: new Date(),
              },
              {
                where: {
                  application_id: foundApplication?.id,
                },
                transaction,
              },
            );

            const careerListCreated = dto.career_ids.map((e: any) => ({
              application_id: foundApplication?.id,
              df_career_id: e,
            }));
            await this.applicationCareerRepository.bulkCreate(
              careerListCreated,
              {
                transaction,
              },
            );
          }

          //Tạo hình thức làm việc
          if (dto.job_type_ids && dto.job_type_ids.length > 0) {
            //Xoá các hình thức làm việc hồ sơ cũ
            await this.applicationJobTypeRepository.update(
              {
                deleted_at: new Date(),
              },
              {
                where: {
                  application_id: foundApplication?.id,
                },
                transaction,
              },
            );

            const jobTypeListCreated = dto.job_type_ids.map((e: any) => ({
              application_id: foundApplication?.id,
              job_type_id: e,
            }));
            await this.applicationJobTypeRepository.bulkCreate(
              jobTypeListCreated,
              {
                transaction,
              },
            );
          }

          if (dto.work_experiences && dto.work_experiences.length > 0) {
            //Xoá các kinh nghiệm làm việc hồ sơ cũ
            await this.workExperienceRepository.update(
              {
                deleted_at: new Date(),
              },
              {
                where: {
                  application_id: foundApplication?.id,
                },
                transaction,
              },
            );

            const workExperience = dto.work_experiences.map((e) => ({
              application_id: foundApplication?.id,
              enterprise_name: e.enterprise_name,
              position: e.position,
              start_time: e.start_time,
              end_time: e.end_time,
              description: e.description,
            }));
            await this.workExperienceRepository.bulkCreate(workExperience, {
              transaction,
            });
          }

          if (
            dto.education_experiences &&
            dto.education_experiences.length > 0
          ) {
            //Xoá các kinh nghiệm học tập làm việc hồ sơ cũ
            await this.educationExperienceRepository.update(
              {
                deleted_at: new Date(),
              },
              {
                where: {
                  application_id: foundApplication?.id,
                },
                transaction,
              },
            );

            const educationExperience = dto.education_experiences.map((e) => ({
              application_id: foundApplication?.id,
              candidate_information_id:
                foundApplication.candidate_information_id,
              school_name: e.school_name,
              major: e.major,
              start_time: e.start_time,
              end_time: e.end_time,
              description: e.description,
            }));
            await this.educationExperienceRepository.bulkCreate(
              educationExperience,
              {
                transaction,
              },
            );
          }

          if (dto.skill_experiences && dto.skill_experiences.length > 0) {
            //Xoá các kinh nghiệm học tập làm việc hồ sơ cũ
            await this.skillExperienceRepository.update(
              {
                deleted_at: new Date(),
              },
              {
                where: {
                  application_id: foundApplication?.id,
                },
                transaction,
              },
            );

            const skillExperience = dto.skill_experiences.map((e) => ({
              application_id: foundApplication.id,
              candidate_information_id:
                foundApplication.candidate_information_id,
              skill_name: e.skill_name,
              rating: e.rating,
              description: e.description,
            }));
            await this.skillExperienceRepository.bulkCreate(skillExperience, {
              transaction,
            });
          }

          if (dto.referrer) {
            //Xoá các thông tin người giới thiệu hồ sơ cũ
            await this.referrerRepository.update(
              {
                deleted_at: new Date(),
              },
              {
                where: {
                  application_id: foundApplication?.id,
                },
                transaction,
              },
            );

            await this.referrerRepository.create(
              {
                application_id: foundApplication?.id,
                full_name: dto?.referrer?.full_name || null,
                phone_number: dto?.referrer?.phone_number || null,
                email: dto?.referrer?.email || null,
                position_input: dto?.referrer?.position_input || null,
              },
              {
                transaction,
              },
            );
          }
        },
      );
    }

    return sendSuccess({
      data: result,
      msg: 'Tạo hồ sơ ứng viên/cộng tác viên thành công',
      blocks: {},
    });
  }

  //Tạo Hồ sơ ứng viên
  async createApplication(user_id: number, dto: CreateApplicationDto) {
    const foundCandidate = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      include: [
        {
          model: CandidateInformation,
          as: 'candidate_information',
          attributes: ['id', 'user_id'],
        },
      ],
    });

    if (!foundCandidate || !foundCandidate?.candidate_information?.id) {
      throw new HttpException(
        'Ứng viên/Cộng tác viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    if (dto.job_type_ids) {
      const jobType: any = await this.jobTypeRepository.foundJobType(
        dto.job_type_ids,
      );
      if (!Array.isArray(jobType) && jobType.length === 0) {
        throw new HttpException(
          'Hình thức làm việc không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto.is_all_province == IS_ACTIVE.ACTIVE) {
      if (dto.province_ids && dto.province_ids.length > 0) {
        throw new HttpException(
          'Vui lòng không chọn khu vực làm việc ',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (dto.province_ids && dto.province_ids.length > 0) {
      const province = await this.dfProvinceRepository.findAll({
        where: {
          id: { [Op.in]: dto.province_ids },
        },
      });
      if (province?.length != dto.province_ids.length) {
        throw new HttpException(
          'Khu vực làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.year_of_experience_id) {
      const yearsOfExperience =
        await this.yearOfExperienceRepository.findYearOfExperience(
          dto.year_of_experience_id,
        );
      if (!yearsOfExperience) {
        throw new HttpException(
          'Kinh nghiệm làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto.degree_id) {
      const degree = await this.dfDegreeRepository.findOne({
        where: {
          id: dto.degree_id,
        },
      });
      if (!degree) {
        throw new HttpException(
          'Bằng cấp không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto?.position_id) {
      const foundPosition = await this.positionRepository.findOne({
        where: {
          id: dto?.position_id,
        },
      });

      if (!foundPosition) {
        throw new HttpException(
          'Vị trí tuyển dụng không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto.gender_id) {
      const gender = await this.genderRepository.findGender(dto.gender_id);
      if (!gender) {
        throw new HttpException(
          'Giới tính không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    let salaryRange: null | SalaryRange = null;
    if (dto.salary_range_id) {
      salaryRange = await this.salaryRangeRepository.findSalaryRange(
        dto.salary_range_id,
      );
      if (!salaryRange) {
        throw new HttpException(
          'Mức lương không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        const payloadCreate = {
          application_name:
            dto?.application_name ||
            `Hồ sơ ứng viên - ${foundCandidate.full_name} - ${uuidv4()}`,
          avatar: dto?.avatar || null,
          full_name: dto?.full_name || null,
          phone_number: dto?.phone_number || null,
          email: dto?.email || null,
          address: dto?.address || null,
          education: dto?.education || null,
          gender_id: dto?.gender_id || null,
          skill_input: dto?.skill_input || null,
          career_goals: dto?.career_goals || null,
          position_input: dto?.position_input || null,
          date_of_birth: dto?.date_of_birth || null,
          candidate_information_id: foundCandidate.candidate_information.id,
          year_of_experience_id: +dto.year_of_experience_id || null,
          salary_range_id: salaryRange ? +dto.salary_range_id : null,
          degree_id: dto.degree_id || null,
          is_all_province: dto.is_all_province,
          position_id: dto.position_id || null,
        };

        const application: any = await this.applicationRepository.create(
          payloadCreate,
          {
            transaction,
          },
        );
        if (dto.province_ids && dto.province_ids.length > 0) {
          const created = dto.province_ids.map((e) => ({
            application_id: application?.id,
            df_province_id: e,
          }));
          await this.applicationProvinceRepository.bulkCreate(created, {
            transaction,
          });
        }

        //Tạo ngành nghề quan tâm
        if (dto.career_ids && dto.career_ids.length > 0) {
          const careerListCreated = dto.career_ids.map((e: any) => ({
            application_id: application?.id,
            df_career_id: e,
          }));
          await this.applicationCareerRepository.bulkCreate(careerListCreated, {
            transaction,
          });
        }

        //Tạo hình thức làm việc
        if (dto.job_type_ids && dto.job_type_ids.length > 0) {
          const jobTypeListCreated = dto.job_type_ids.map((e: any) => ({
            application_id: application?.id,
            job_type_id: e,
          }));
          await this.applicationJobTypeRepository.bulkCreate(
            jobTypeListCreated,
            {
              transaction,
            },
          );
        }

        if (dto.work_experiences && dto.work_experiences.length > 0) {
          const workExperience = dto.work_experiences.map((e) => ({
            application_id: application?.id,
            enterprise_name: e.enterprise_name,
            position: e.position,
            start_time: e.start_time,
            end_time: e.end_time,
            description: e.description,
          }));
          await this.workExperienceRepository.bulkCreate(workExperience, {
            transaction,
          });
        }

        if (dto.education_experiences && dto.education_experiences.length > 0) {
          const educationExperience = dto.education_experiences.map((e) => ({
            application_id: application?.id,
            candidate_information_id: foundCandidate.candidate_information.id,
            school_name: e.school_name,
            major: e.major,
            start_time: e.start_time,
            end_time: e.end_time,
            description: e.description,
          }));
          await this.educationExperienceRepository.bulkCreate(
            educationExperience,
            {
              transaction,
            },
          );
        }

        if (dto.skill_experiences && dto.skill_experiences.length > 0) {
          const skillExperience = dto.skill_experiences.map((e) => ({
            application_id: application?.id,
            candidate_information_id: foundCandidate.candidate_information.id,
            skill_name: e.skill_name,
            rating: e.rating,
            description: e.description,
          }));
          await this.skillExperienceRepository.bulkCreate(skillExperience, {
            transaction,
          });
        }

        if (dto.referrer) {
          await this.referrerRepository.create(
            {
              application_id: application?.id,
              full_name: dto?.referrer?.full_name || null,
              phone_number: dto?.referrer?.phone_number || null,
              email: dto?.referrer?.email || null,
              position_input: dto?.referrer?.position_input || null,
            },
            {
              transaction,
            },
          );
        }

        return application;
      },
    );

    return sendSuccess({
      data: result,
      msg: 'Tạo hồ sơ ứng viên/cộng tác viên thành công',
      blocks: {},
    });
  }

  //Cập nhật Hồ sơ ứng viên
  async updateApplication(user_id: number, dto: UpdateApplicationDto) {
    const foundApplication = await this.applicationRepository.findOne({
      where: {
        id: dto.application_id,
      },
    });

    if (!foundApplication) {
      throw new HttpException(
        'Hồ sơ ứng viên/cộng tác viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    if (dto.job_type_ids) {
      const jobType: any = await this.jobTypeRepository.foundJobType(
        dto.job_type_ids,
      );
      if (!Array.isArray(jobType) && jobType.length === 0) {
        throw new HttpException(
          'Hình thức làm việc không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto.is_all_province == IS_ACTIVE.ACTIVE) {
      if (dto.province_ids && dto.province_ids.length > 0) {
        throw new HttpException(
          'Vui lòng không chọn khu vực làm việc ',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (dto.province_ids && dto.province_ids.length > 0) {
      const province = await this.dfProvinceRepository.findAll({
        where: {
          id: { [Op.in]: dto.province_ids },
        },
      });
      if (province?.length != dto.province_ids.length) {
        throw new HttpException(
          'Khu vực làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.year_of_experience_id) {
      const yearsOfExperience =
        await this.yearOfExperienceRepository.findYearOfExperience(
          dto.year_of_experience_id,
        );
      if (!yearsOfExperience) {
        throw new HttpException(
          'Kinh nghiệm làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto.degree_id) {
      const degree = await this.dfDegreeRepository.findOne({
        where: {
          id: dto.degree_id,
        },
      });
      if (!degree) {
        throw new HttpException(
          'Bằng cấp không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto?.position_id) {
      const foundPosition = await this.positionRepository.findOne({
        where: {
          id: dto?.position_id,
        },
      });

      if (!foundPosition) {
        throw new HttpException(
          'Vị trí tuyển dụng không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto.gender_id) {
      const gender = await this.genderRepository.findGender(dto.gender_id);
      if (!gender) {
        throw new HttpException(
          'Giới tính không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    let salaryRange: null | SalaryRange = null;
    if (dto.salary_range_id) {
      salaryRange = await this.salaryRangeRepository.findSalaryRange(
        dto.salary_range_id,
      );
      if (!salaryRange) {
        throw new HttpException(
          'Mức lương không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        const payloadUpdate = {
          application_name:
            dto?.application_name || foundApplication.application_name,
          avatar: dto?.avatar || null,
          full_name: dto?.full_name || null,
          phone_number: dto?.phone_number || null,
          email: dto?.email || null,
          address: dto?.address || null,
          education: dto?.education || null,
          gender_id: dto?.gender_id || null,
          skill_input: dto?.skill_input || null,
          career_goals: dto?.career_goals || null,
          position_input: dto?.position_input || null,
          date_of_birth: dto?.date_of_birth || null,
          year_of_experience_id: +dto.year_of_experience_id || null,
          salary_range_id: salaryRange ? +dto.salary_range_id : null,
          degree_id: dto.degree_id || null,
          is_all_province: dto.is_all_province,
          position_id: dto.position_id || null,
          is_main: dto.is_main || 0,
        };

        if (dto.is_main) {
          await Application.update(
            {
              is_main: 0,
            },
            {
              where: {
                candidate_information_id:
                  foundApplication.candidate_information_id,
                id: {
                  [Op.ne]: dto.application_id,
                },
              },
              transaction,
            },
          );
        }

        await this.applicationRepository.update(payloadUpdate, {
          where: {
            id: foundApplication.id,
          },
          transaction,
        });
        if (dto.province_ids && dto.province_ids.length > 0) {
          //Xoá các địa chỉ hồ sơ cũ
          await this.applicationProvinceRepository.update(
            {
              deleted_at: new Date(),
            },
            {
              where: {
                application_id: foundApplication?.id,
              },
              transaction,
            },
          );

          const created = dto.province_ids.map((e) => ({
            application_id: foundApplication?.id,
            df_province_id: e,
          }));
          await this.applicationProvinceRepository.bulkCreate(created, {
            transaction,
          });
        }

        //Tạo ngành nghề quan tâm
        if (dto.career_ids && dto.career_ids.length > 0) {
          //Xoá các nghành nghề hồ sơ cũ
          await this.applicationCareerRepository.update(
            {
              deleted_at: new Date(),
            },
            {
              where: {
                application_id: foundApplication?.id,
              },
              transaction,
            },
          );

          const careerListCreated = dto.career_ids.map((e: any) => ({
            application_id: foundApplication?.id,
            df_career_id: e,
          }));
          await this.applicationCareerRepository.bulkCreate(careerListCreated, {
            transaction,
          });
        }

        //Tạo hình thức làm việc
        if (dto.job_type_ids && dto.job_type_ids.length > 0) {
          //Xoá các hình thức làm việc hồ sơ cũ
          await this.applicationJobTypeRepository.update(
            {
              deleted_at: new Date(),
            },
            {
              where: {
                application_id: foundApplication?.id,
              },
              transaction,
            },
          );

          const jobTypeListCreated = dto.job_type_ids.map((e: any) => ({
            application_id: foundApplication?.id,
            job_type_id: e,
          }));
          await this.applicationJobTypeRepository.bulkCreate(
            jobTypeListCreated,
            {
              transaction,
            },
          );
        }

        if (dto.work_experiences && dto.work_experiences.length > 0) {
          //Xoá các kinh nghiệm làm việc hồ sơ cũ
          await this.workExperienceRepository.update(
            {
              deleted_at: new Date(),
            },
            {
              where: {
                application_id: foundApplication?.id,
              },
              transaction,
            },
          );

          const workExperience = dto.work_experiences.map((e) => ({
            application_id: foundApplication?.id,
            enterprise_name: e.enterprise_name,
            position: e.position,
            start_time: e.start_time,
            end_time: e.end_time,
            description: e.description,
          }));
          await this.workExperienceRepository.bulkCreate(workExperience, {
            transaction,
          });
        }

        if (dto.education_experiences && dto.education_experiences.length > 0) {
          //Xoá các kinh nghiệm học tập làm việc hồ sơ cũ
          await this.educationExperienceRepository.update(
            {
              deleted_at: new Date(),
            },
            {
              where: {
                application_id: foundApplication?.id,
              },
              transaction,
            },
          );

          const educationExperience = dto.education_experiences.map((e) => ({
            application_id: foundApplication?.id,
            candidate_information_id: foundApplication.candidate_information_id,
            school_name: e.school_name,
            major: e.major,
            start_time: e.start_time,
            end_time: e.end_time,
            description: e.description,
          }));
          await this.educationExperienceRepository.bulkCreate(
            educationExperience,
            {
              transaction,
            },
          );
        }

        if (dto.skill_experiences && dto.skill_experiences.length > 0) {
          //Xoá các kinh nghiệm học tập làm việc hồ sơ cũ
          await this.skillExperienceRepository.update(
            {
              deleted_at: new Date(),
            },
            {
              where: {
                application_id: foundApplication?.id,
              },
              transaction,
            },
          );

          const skillExperience = dto.skill_experiences.map((e) => ({
            application_id: dto.application_id,
            candidate_information_id: foundApplication.candidate_information_id,
            skill_name: e.skill_name,
            rating: e.rating,
            description: e.description,
          }));
          await this.skillExperienceRepository.bulkCreate(skillExperience, {
            transaction,
          });
        }

        if (dto.referrer) {
          //Xoá các thông tin người giới thiệu hồ sơ cũ
          await this.referrerRepository.update(
            {
              deleted_at: new Date(),
            },
            {
              where: {
                application_id: foundApplication?.id,
              },
              transaction,
            },
          );

          await this.referrerRepository.create(
            {
              application_id: foundApplication?.id,
              full_name: dto?.referrer?.full_name || null,
              phone_number: dto?.referrer?.phone_number || null,
              email: dto?.referrer?.email || null,
              position_input: dto?.referrer?.position_input || null,
            },
            {
              transaction,
            },
          );
        }
      },
    );

    return sendSuccess({
      data: foundApplication,
      msg: 'Cập nhật hồ sơ ứng viên/cộng tác viên thành công',
      blocks: {},
    });
  }

  async getMyApplication(user_id: number) {
    const foundCandidate = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      include: [
        {
          model: CandidateInformation,
          as: 'candidate_information',
          attributes: ['id', 'user_id'],
        },
      ],
    });

    if (!foundCandidate || !foundCandidate?.candidate_information?.id) {
      throw new HttpException(
        'Ứng viên/Cộng tác viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const foundApplication = await this.applicationRepository.findOne({
      where: {
        candidate_information_id: foundCandidate.candidate_information.id,
        is_main: 1,
      },
      include: [
        {
          model: DFDegree,
        },
        {
          model: YearOfExperience,
        },
        {
          model: Position,
        },
        {
          model: SalaryRange,
        },
        {
          model: ApplicationCareer,
          include: [
            {
              model: DFCareer,
            },
          ],
        },
        {
          model: ApplicationProvince,
          include: [
            {
              model: DFProvince,
            },
          ],
        },
        {
          model: ApplicationJobType,
          include: [
            {
              model: JobType,
              attributes: [
                'id',
                'job_type_time_id',
                'job_type_workplace_id',
                'name',
              ],
              include: [
                {
                  model: JobTypeTime,
                  attributes: ['id', 'name', 'description'],
                },
                {
                  model: JobTypeWorkplace,
                  attributes: ['id', 'name', 'description'],
                },
              ],
            },
          ],
        },
        {
          model: WorkExperience,
        },
        {
          model: EducationExperience,
        },
        {
          model: SkillExperience,
        },
        {
          model: Referrer,
        },
      ],
    });

    return sendSuccess({
      data: foundApplication,
      msg: 'Lấy chi tiết hồ sơ ứng viên/cộng tác viên thành công',
      blocks: {},
    });
  }

  async getDetailApplication(user_id: number) {
    const foundCandidate = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      include: [
        {
          model: CandidateInformation,
          as: 'candidate_information',
          attributes: ['id', 'user_id'],
        },
      ],
    });

    if (!foundCandidate || !foundCandidate?.candidate_information?.id) {
      throw new HttpException(
        'Ứng viên/Cộng tác viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const foundApplication = await this.applicationRepository.findOne({
      where: {
        candidate_information_id: foundCandidate.candidate_information.id,
      },
      include: [
        {
          model: DFDegree,
        },
        {
          model: YearOfExperience,
        },
        {
          model: Position,
        },
        {
          model: SalaryRange,
        },
        {
          model: ApplicationCareer,
          include: [
            {
              model: DFCareer,
            },
          ],
        },
        {
          model: ApplicationProvince,
          include: [
            {
              model: DFProvince,
            },
          ],
        },
        {
          model: ApplicationJobType,
          include: [
            {
              model: JobType,
              attributes: [
                'id',
                'job_type_time_id',
                'job_type_workplace_id',
                'name',
              ],
              include: [
                {
                  model: JobTypeTime,
                  attributes: ['id', 'name', 'description'],
                },
                {
                  model: JobTypeWorkplace,
                  attributes: ['id', 'name', 'description'],
                },
              ],
            },
          ],
        },
        {
          model: WorkExperience,
        },
      ],
    });

    return sendSuccess({
      data: foundApplication,
      msg: 'Lấy chi tiết hồ sơ ứng viên/cộng tác viên thành công',
      blocks: {},
    });
  }

  async updateWorkExperience(user_id: number, dto: UpdateWorkExperienceDto) {
    const foundApplication = await this.applicationRepository.findOne({
      where: {
        id: dto.application_id,
      },
    });

    if (!foundApplication) {
      throw new HttpException(
        'Hồ sơ ứng viên/cộng tác viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        if (dto.work_experiences && dto.work_experiences.length > 0) {
          //Xoá các kinh nghiệm làm việc hồ sơ cũ
          await this.workExperienceRepository.update(
            {
              deleted_at: new Date(),
            },
            {
              where: {
                application_id: foundApplication?.id,
              },
              transaction,
            },
          );

          const workExperience = dto.work_experiences.map((e) => ({
            application_id: foundApplication?.id,
            enterprise_name: e.enterprise_name,
            position: e.position,
            start_time: e.start_time,
            end_time: e.end_time,
            description: e.description,
          }));
          await this.workExperienceRepository.bulkCreate(workExperience, {
            transaction,
          });
        }

        return foundApplication;
      },
    );

    return sendSuccess({
      data: result,
      msg: 'Cập nhật kinh nghiệm làm việc ứng viên/cộng tác viên thành công',
      blocks: {},
    });
  }

  async updateCVFile(user_id: number, dto: updateCVFileDto) {
    const foundCandidateInformation: any =
      await this.candidateInformationRepository.findOne({
        where: {
          user_id,
        },
      });
    const foundApplication = await Application.findOne({
      where: {
        id: dto.application_id,
        candidate_information_id: foundCandidateInformation?.id,
      },
    });

    if (!foundApplication) {
      throw new HttpException(
        'Hồ sơ ứng viên/cộng tác viên không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    const allApplications = await Application.findAll({
      where: {
        candidate_information_id: foundCandidateInformation.id,
      },
      attributes: ['id', 'application_name'],
      order: [['id', 'ASC']],
    });

    const index = allApplications.findIndex(
      (elm) => elm.id === foundApplication.id,
    );

    await this.applicationCVRepository.destroy({
      where: { application_id: foundApplication?.id },
      force: true,
    });

    const applicationCV = await this.applicationCVRepository.create({
      application_id: foundApplication?.id,
      file: dto.file,
      file_name:
        dto.file_name.split('.')[0] +
        `(${index + 1})` +
        '.' +
        dto.file_name.split('.')[1],
      is_main: 1,
    });

    return sendSuccess({
      data: applicationCV,
      msg: 'Cập nhật CV chính thành công',
      blocks: {},
    });
  }

  async getMainCv(user_id: number) {
    const foundCandidate = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      include: [
        {
          model: CandidateInformation,
          as: 'candidate_information',
          attributes: ['id', 'user_id'],
        },
      ],
    });

    if (!foundCandidate || !foundCandidate?.candidate_information?.id) {
      throw new HttpException(
        'Ứng viên/Cộng tác viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const foundApplication = await this.applicationRepository.findOne({
      where: {
        candidate_information_id: foundCandidate.candidate_information.id,
      },
    });

    const foundMainCv = await this.applicationCVRepository.findOne({
      where: {
        application_id: foundApplication?.id,
        is_main: 1,
      },
    });
    return sendSuccess({
      data: foundMainCv,
      msg: 'Lấy cv chính của ứng viên/cộng tác viên thành công',
      blocks: {},
    });
  }

  async detailWallet(id: number, dto: CandidateFilterDetailWalletDto) {
    const wallet = await this.walletRepository.findOne({
      where: { user_id: id },
      include: { model: User },
    });
    if (!wallet) {
      throw new HttpException(
        'Ví ứng viên/cộng tác viên không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const whereCondition: any = {
      wallet_id: wallet.id,
    };
    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }
    if (dto.status) {
      whereCondition.mutable_type = dto.status;
    }
    const options: any = {
      where: whereCondition,
      include: [
        { model: User },
        { model: RecruitmentRequirement, include: { model: Enterprise } },
        {
          model: CandidateInformation,
          as: 'candidate_information',
          include: { model: User },
        },
      ],
      order: [['id', 'DESC']],
    };
    const count = await this.walletHistoryRepository.count(options);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const walletHistory = await this.walletHistoryRepository.findAll(options);
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({
      data: { wallet, wallet_history: walletHistory },
      paging,
    });
  }

  async walletRequirementHistory(
    id: number,
    dto: CandidateFilterDetailWalletDto,
  ) {
    const whereCondition: any = {
      user_id: id,
    };

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }

    const options: any = {
      where: whereCondition,
      include: [
        { model: Wallet },
        { model: DFBank },
        // { model: User }
      ],
      order: [['created_at', 'DESC']],
    };
    const count = await this.walletRequirementRepository.count(options);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const walletRequirements = await this.walletRequirementRepository.findAll(
      options,
    );

    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };

    return sendSuccess({
      data: {
        status: WALLET_REQUIREMENT_STATUS,
        wallet_requirement: walletRequirements,
      },
      paging,
    });
  }

  async walletRequirementRecently(user_id: number) {
    const whereCondition: any = {
      user_id,
    };

    const options: any = {
      where: whereCondition,
      include: [
        { model: Wallet },
        { model: DFBank },
        // { model: User }
      ],
      order: [['created_at', 'DESC']],
    };

    const walletRequirement = await this.walletRequirementRepository.findOne(
      options,
    );

    return sendSuccess({
      data: {
        status: WALLET_REQUIREMENT_STATUS,
        wallet_requirement: walletRequirement,
      },
    });
  }

  async sendWalletRequirement(id: number, dto: WalletRequirementDto) {
    const foundUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!foundUser) {
      throw new HttpException(
        'Ứng viên/Cộng tác viên không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const wallet = await this.walletRepository.findOne({
      where: { user_id: id },
      include: { model: User },
    });
    if (!wallet) {
      throw new HttpException(
        'Ví ứng viên/cộng tác viên không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const foundBank = await this.dfBankRepository.findOne({
      where: {
        id: dto.bank_id,
      },
    });
    if (!foundBank) {
      throw new HttpException(
        'Ngân hàng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        const payloadCreate = {
          user_id: foundUser.id,
          wallet_id: wallet.id,
          money: dto.money,
          to_user: dto.to_user,
          bank_id: dto.bank_id,
          bank_account: dto.bank_account,
          status: WALLET_REQUIREMENT_STATUS.PENDING,
        };
        const walletRequirement = await this.walletRequirementRepository.create(
          payloadCreate,
          {
            transaction,
          },
        );

        return walletRequirement;
      },
    );

    //Gửi thông báo yêu cầu rút tiền ứng viên/cộng tác viên tới admin
    const notificationPayload: NotificationPayload = {
      title: `Bạn vừa nhận được một yêu cầu rút tiền - ${foundUser?.full_name}`,
      content: `Bạn vừa nhận được một yêu cầu rút tiền - ${foundUser?.full_name}`,
      type: NOTIFICATION_TYPE.NEW_WALLET_REQUIREMENT,
      data: {
        user_id: foundUser?.id,
        wallet_requirement_id: result?.wallet?.id,
      },
    };
    this.notificationService.createAndSendNotificationForUsers(
      notificationPayload,
      {
        role_id: [ROLE.ADMIN],
      },
    );

    return sendSuccess({
      data: result,
      msg: 'Yêu cầu rút tiền của bạn đang được xử lý',
      blocks: {},
    });
  }

  async getApplicationList(user_id: number, dto: FilterApplicationDto) {
    const foundCandidateInformation: any =
      await this.candidateInformationRepository.findOne({
        where: {
          user_id,
        },
      });

    const whereCondition: any = {
      [Op.and]: [
        {
          candidate_information_id: foundCandidateInformation.id,
        },
      ],
    };

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }

    const includeCountOptions: any = [];
    const includeOptions: any = [
      {
        model: DFDegree,
      },
      {
        model: YearOfExperience,
      },
      {
        model: Position,
      },
      {
        model: SalaryRange,
      },
      {
        model: ApplicationCareer,
        include: [
          {
            model: DFCareer,
          },
        ],
      },
      {
        model: ApplicationProvince,
        include: [
          {
            model: DFProvince,
          },
        ],
      },
      {
        model: ApplicationJobType,
        include: [
          {
            model: JobType,
            attributes: [
              'id',
              'job_type_time_id',
              'job_type_workplace_id',
              'name',
            ],
            include: [
              {
                model: JobTypeTime,
                attributes: ['id', 'name', 'description'],
              },
              {
                model: JobTypeWorkplace,
                attributes: ['id', 'name', 'description'],
              },
            ],
          },
        ],
      },
      {
        model: WorkExperience,
      },
      {
        model: EducationExperience,
      },
      {
        model: SkillExperience,
      },
      {
        model: Referrer,
      },
      {
        model: ApplicationCV,
      },
    ];

    const options: any = {
      where: whereCondition,
      attributes: {
        include: [],
      },
      include: includeOptions,
      order: [['id', 'DESC']],
    };
    const countOptions: any = {
      where: whereCondition,
    };

    const count = await this.applicationRepository.count(countOptions);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const applications: any = await this.applicationRepository.findAll(options);

    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({
      data: applications,
      paging,
    });
  }

  async getCVUploadeds(user_id: number, dto: FilterApplicationDto) {
    const foundCandidateInformation: any =
      await this.candidateInformationRepository.findOne({
        where: {
          user_id,
        },
      });

    const whereCondition: any = {
      [Op.and]: [
        {
          candidate_information_id: foundCandidateInformation.id,
        },
      ],
    };
    if (dto.for_apply && dto.for_apply.toString() === 'true') {
      whereCondition[Op.and].push({
        status: { [Op.ne]: CV_UPLOAD_STATUS.PENDING },
      });
    }

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }

    const includeCountOptions: any = [];
    const includeOptions: any = [
      {
        model: CandidateInformation,
        as: 'candidate_information',
      },
      {
        model: CandidateInformation,
        as: 'candidate_infor_review',
      },
    ];

    const options: any = {
      where: whereCondition,
      attributes: {
        include: [],
      },
      include: includeOptions,
      order: [['id', 'DESC']],
    };
    const countOptions: any = {
      where: whereCondition,
    };

    const count = await CVUploaded.count(countOptions);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const CVUploadeds: any = await CVUploaded.findAll(options);

    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({
      data: CVUploadeds,
      paging,
    });
  }

  async getDetailApplicationFromList(application_id: number) {
    const foundApplication = await this.applicationRepository.findOne({
      where: {
        id: application_id,
      },
      include: [
        {
          model: DFDegree,
        },
        {
          model: YearOfExperience,
        },
        {
          model: Position,
        },
        {
          model: SalaryRange,
        },
        {
          model: ApplicationCareer,
          include: [
            {
              model: DFCareer,
            },
          ],
        },
        {
          model: ApplicationProvince,
          include: [
            {
              model: DFProvince,
            },
          ],
        },
        {
          model: ApplicationJobType,
          include: [
            {
              model: JobType,
              attributes: [
                'id',
                'job_type_time_id',
                'job_type_workplace_id',
                'name',
              ],
              include: [
                {
                  model: JobTypeTime,
                  attributes: ['id', 'name', 'description'],
                },
                {
                  model: JobTypeWorkplace,
                  attributes: ['id', 'name', 'description'],
                },
              ],
            },
          ],
        },
        {
          model: WorkExperience,
        },
        {
          model: EducationExperience,
        },
        {
          model: SkillExperience,
        },
        {
          model: Referrer,
        },
        {
          model: ApplicationCV,
        },
      ],
    });

    return sendSuccess({
      data: foundApplication,
      msg: 'Lấy chi tiết hồ sơ ứng viên/cộng tác viên thành công',
      blocks: {},
    });
  }

  //Xoá Hồ sơ ứng viên
  async deleteApplication(user_id: number, id: number) {
    const foundCandidateInformation: any = await CandidateInformation.findOne({
      where: {
        user_id,
      },
    });
    const foundApplication = await this.applicationRepository.findOne({
      where: {
        id: id,
        candidate_information_id: foundCandidateInformation.id,
      },
    });

    if (!foundApplication) {
      throw new HttpException(
        'Hồ sơ ứng viên/cộng tác viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      await this.applicationRepository.update(
        {
          deleted_at: new Date(),
        },
        {
          where: {
            id: foundApplication.id,
          },
          transaction,
        },
      );

      await this.applicationCVRepository.update(
        {
          deleted_at: new Date(),
        },
        {
          where: {
            application_id: foundApplication.id,
          },
          transaction,
        },
      );
    });

    return sendSuccess({
      data: {},
      msg: 'Xoá hồ sơ ứng viên/cộng tác viên thành công',
      blocks: {},
    });
  }

  //Sửa tên Hồ sơ ứng viên/cộng tác viên
  async editApplicationName(user_id: number, dto: EditApplicationNameDto) {
    const foundCandidateInformation: any = await CandidateInformation.findOne({
      where: {
        user_id,
      },
    });
    const foundApplication = await this.applicationRepository.findOne({
      where: {
        id: dto.application_id,
        candidate_information_id: foundCandidateInformation.id,
      },
    });

    if (!foundApplication) {
      throw new HttpException(
        'Hồ sơ ứng viên/cộng tác viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      await this.applicationRepository.update(
        {
          application_name: dto.application_name,
        },
        {
          where: {
            id: foundApplication.id,
          },
          transaction,
        },
      );
    });

    return sendSuccess({
      data: {},
      msg: 'Sửa tên hồ sơ ứng viên/cộng tác viên thành công',
      blocks: {},
    });
  }

  //Đặt hồ sơ ứng viên chính thức
  async chooseMainApplication(user_id: number, dto: ApplicationIdDto) {
    const foundCandidateInformation: any = await CandidateInformation.findOne({
      where: {
        user_id,
      },
    });
    const foundApplication = await this.applicationRepository.findOne({
      where: {
        id: dto.application_id,
        candidate_information_id: foundCandidateInformation.id,
      },
    });

    if (!foundApplication) {
      throw new HttpException(
        'Hồ sơ ứng viên/cộng tác viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      //Cập nhật các application khác
      await this.applicationRepository.update(
        {
          is_main: 0,
        },
        {
          where: {
            candidate_information_id: foundCandidateInformation.id,
          },
          transaction,
        },
      );

      await this.applicationRepository.update(
        {
          is_main: foundApplication.is_main === 1 ? 0 : 1,
        },
        {
          where: {
            id: foundApplication.id,
          },
          transaction,
        },
      );
    });

    return sendSuccess({
      data: {},
      msg: 'Sửa tên hồ sơ ứng viên/cộng tác viên thành công',
      blocks: {},
    });
  }

  //Sửa tên Hồ sơ ứng viên/cộng tác viên
  async changeCVName(user_id: number, dto: ChangeCVNameDto) {
    const foundCandidateInformation: any = await CandidateInformation.findOne({
      where: {
        user_id,
      },
    });
    const foundCV = await CVUploaded.findOne({
      where: {
        id: dto.cv_file_id,
        candidate_information_id: foundCandidateInformation.id,
      },
    });

    if (!foundCV) {
      throw new HttpException(
        'Hồ sơ ứng viên/cộng tác viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.sequelize.transaction(async (transaction: Transaction) => {
      await CVUploaded.update(
        {
          file_name: dto.file_name,
        },
        {
          where: {
            id: dto.cv_file_id,
            candidate_information_id: foundCandidateInformation.id,
          },
          transaction,
        },
      );
    });

    return sendSuccess({
      data: {},
      msg: 'Sửa tên hồ sơ ứng viên/cộng tác viên thành công',
      blocks: {},
    });
  }

  async uploadCVFile(user_id: number, dto: FileCVUpload) {
    const foundCandidateInformation =
      await this.candidateInformationRepository.findOne({
        where: {
          id: dto.candidate_information_id,
        },
      });

    if (!foundCandidateInformation) {
      throw new HttpException(
        'Thông tin ứng viên/cộng tác viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        //Clone candidate (status: PENDING - 3 (CANDIDATE_STATUS))
        const { created_at, updated_at, ...userData }: any =
          await this.userRepository.findOne({
            where: {
              id: user_id,
            },
          });

        const payloadCreate = {
          gender_id: userData.dataValues.gender_id,
          role_id: ROLE.CANDIDATE, // CTV,UV đều clone tạo tk thuộc loại ứng viên
          full_name: userData.dataValues.full_name,
          email: userData.dataValues.email,
          phone_number: userData.dataValues.phone_number,
          password: userData.dataValues.password,
          alternate_phone: userData.dataValues.alternate_phone,
          avatar: userData.dataValues.avatar,
          date_of_birth: userData.dataValues.date_of_birth,
          status: userData.dataValues.status,
          is_save_searching: userData.dataValues.is_save_searching || 0,
        };

        const clonedUser = await this.userRepository.create(payloadCreate, {
          transaction,
        });

        let cloneCandidateInformation: any = null;
        if (clonedUser) {
          const {
            id,
            created_at,
            updated_at,
            status,
            ...candidateInforData
          }: any = await this.candidateInformationRepository.findOne({
            where: {
              user_id,
            },
          });

          const payloadCreateCandidateInfor = {
            user_id: clonedUser.id,
            years_of_experience_id:
              foundCandidateInformation.dataValues.years_of_experience_id,
            position_id: foundCandidateInformation.dataValues.position_id,
            degree_id: foundCandidateInformation.dataValues.degree_id,
            professional_field_id:
              foundCandidateInformation.dataValues.professional_field_id,
            professional_field:
              foundCandidateInformation.dataValues.professional_field,
            is_all_province:
              foundCandidateInformation.dataValues.is_all_province,
            salary_range_id:
              foundCandidateInformation.dataValues.salary_range_id,
            note: foundCandidateInformation.dataValues.note,
            skill_input: foundCandidateInformation.dataValues.skill_input,
            is_recruitment: foundCandidateInformation.dataValues.is_recruitment,
            created_by: foundCandidateInformation.dataValues.created_by,
            is_hire: foundCandidateInformation.dataValues.is_hire,
            type_on_call: foundCandidateInformation.dataValues.type_on_call,
            type_on_hour: foundCandidateInformation.dataValues.type_on_hour,
            budget_min: foundCandidateInformation.dataValues.budget_min,
            budget_max: foundCandidateInformation.dataValues.budget_max,
          };

          cloneCandidateInformation =
            await this.candidateInformationRepository.create(
              {
                ...payloadCreateCandidateInfor,
                status:
                  userData.dataValues.role_id === ROLE.COLLABORATOR
                    ? CANDIDATE_STATUS.OPEN_CV
                    : CANDIDATE_STATUS.PENDING,
              },
              { transaction },
            );

          //clone bằng cấp cao nhất, số năm kinh nghiệm , vị trí chức vụ mong muốn, mức lương mong muốn của ứng viên (nếu có)
          const foundCandidateInterest: any = await CandidateInterest.findOne({
            where: {
              candidate_information_id: foundCandidateInformation.id,
            },
          });
          const payloadCreateCandidateInterest = {
            candidate_information_id: cloneCandidateInformation.id,
            df_degree_id: foundCandidateInterest?.degree_id,
            year_of_experience_id:
              foundCandidateInterest?.year_of_experience_id,
            position_id: foundCandidateInterest?.position_id,
            salary_range_id: foundCandidateInterest?.salary_range_id,
          };
          const cloneCandidateInterest = await CandidateInterest.create(
            payloadCreateCandidateInterest,
            {
              transaction,
            },
          );
          //Clone nghề nghiệp quan tâm
          const foundAllCareerInterests = await CandidateInterestCareer.findAll(
            {
              where: {
                candidate_interest_id: foundCandidateInterest.id,
              },
            },
          );
          const careerListCreated = foundAllCareerInterests.map((e: any) => ({
            candidate_interest_id: cloneCandidateInterest?.id,
            df_career_id: e.df_career_id,
          }));

          await CandidateInterestCareer.bulkCreate(careerListCreated, {
            transaction,
          });
        }

        //Lưu thông tin cv từ máy
        const dataCVFromDeviceCreated = {
          file: dto.file,
          file_name: dto.file_name,
          created_by: user_id,
          status: CV_UPLOAD_STATUS.PENDING,
          candidate_information_id: foundCandidateInformation.id,
          candidate_info_review_id: cloneCandidateInformation.id,
          is_main: 0,
        };

        await CVUploaded.create(dataCVFromDeviceCreated, {
          transaction,
        });
      },
    );

    return sendSuccess({ data: result, msg: 'Tải lên thành công' });
  }
}
