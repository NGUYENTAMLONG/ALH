//Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Op } from 'sequelize';
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
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import {
  CANDIDATE_RECRUITMENT_STATUS,
  RECRUITMENT_STATUS,
} from '@utils/constants';
import { convertDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import _ from 'lodash';
import { WebFilterRecruitmentByCandidateDto } from '../dto/filter-recruitment.dto';
import { EnterpriseAddress } from '@models/enterprise-address.model';
import { UserRecruitmentFavoriteRepository } from '@repositories/user-recruitment-favorite.repository';
import { DFWard } from '@models/df-ward.model';
import { DFDistrict } from '@models/df-district.model';
import { Position } from '@models/position.model';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateApplyRepository } from '@repositories/candidate-apply.repository';
import { CandidateApplyFile } from '@models/candidate-apply-file.model';
import * as moment from 'moment';
import { FilterRecruitmentFavoriteDto } from '../dto/favorite-recruitment.dto';
import { RecruitmentIdDto } from '../dto/candidate-recruitment.dto';
@Injectable()
export class WebCandidateRecruitmentService {
  constructor(
    private readonly recruitmentRequirementRepository: RecruitmentRequirementRepository,
    private readonly candidateRecruitmentRepository: CandidateRecruitmentRepository,
    private readonly sequelize: Sequelize,
    private readonly userRecruitmentFavoriteRepository: UserRecruitmentFavoriteRepository,
    private readonly candidateInformationRepository: CandidateInformationRepository,
    private readonly candidateApplyRepository: CandidateApplyRepository,
  ) {}

  async findAllForCandidate(
    user_id: number,
    dto: WebFilterRecruitmentByCandidateDto,
    url: string,
  ) {
    // Tìm các tin tuyển dụng đã yêu thích
    const favoriteRecruitment =
      await this.userRecruitmentFavoriteRepository.findAll({
        where: {
          user_id,
        },
      });
    const favoriteRecruitmentIds = favoriteRecruitment?.map(
      (elm) => elm.recruitment_requirement_id,
    );
    // return favoriteRecruitmentIds;
    const today = moment().startOf('day').toDate();
    const whereCondition: any = {
      [Op.and]: [
        {
          status: {
            [Op.in]: [RECRUITMENT_STATUS.PROCESSED],
            [Op.notIn]: [RECRUITMENT_STATUS.REJECTED, RECRUITMENT_STATUS.DRAFT],
          },
          [Op.or]: [
            {
              apply_deadline: {
                [Op.gte]: today,
              },
            },
            {
              apply_deadline: null,
            },
          ],
        },
      ],
    };

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }

    if (dto.search) {
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            position_input: { [Op.like]: `%${dto.search}%` },
          },
        ],
      });
    }

    if (dto.career_ids) {
      const careerIdsArray: any = dto.career_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            career_id: { [Op.in]: careerIdsArray },
          },
        ],
      });
      // whereCondition.career_id = { [Op.in]: careerIdsArray };
    }

    if (dto.years_of_experience_ids) {
      const yearsOfExperienceIdsArray: any = dto.years_of_experience_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            years_of_experience_id: { [Op.in]: yearsOfExperienceIdsArray },
          },
        ],
      });
    }

    if (dto.professional_field_ids) {
      const professionalFieldIds: any = dto.professional_field_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            professional_field_id: { [Op.in]: professionalFieldIds },
          },
        ],
      });
    }

    if (dto.position_ids) {
      const positionIds: any = dto.position_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            position_id: { [Op.in]: positionIds },
          },
        ],
      });
    }

    if (dto.salary_range_ids) {
      const salaryRangeIds: any = dto.salary_range_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            salary_range_id: { [Op.in]: salaryRangeIds },
          },
        ],
      });
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
      {
        model: CandidateRecruitment,
        include: [
          {
            model: CandidateInformation,
            as: 'candidate_information',
            include: [{ model: User }],
          },
        ],
      },
      { model: RecruitmentRequirementFile },
      { model: SalaryRange },
    ];

    let provinceDataInclude: any = {
      model: RecruitmentRequirementProvince,
      as: 'recruitment_requirement_province',
      include: {
        model: DFProvince,
        attributes: ['id', 'name'],
      },
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
      distinct: true,
      // col: 'RecruitmentRequirement.id',
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

    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };

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
      if (favoriteRecruitmentIds?.includes(recruitment.id)) {
        recruitment.dataValues.is_favorite = true;
      }
      if (applyRecruitmentsIds?.includes(recruitment.id)) {
        recruitment.dataValues.is_applied = true;
      } else {
        recruitment.dataValues.is_applied = false;
      }
    }

    return sendSuccess({
      data: recruitments,
      blocks: {
        status: RECRUITMENT_STATUS,
      },
      paging,
    });
  }

  async findAll(dto: WebFilterRecruitmentByCandidateDto) {
    const today = moment().startOf('day').toDate();
    const whereCondition: any = {
      [Op.and]: [
        {
          status: {
            [Op.in]: [RECRUITMENT_STATUS.PROCESSED],
            [Op.notIn]: [RECRUITMENT_STATUS.REJECTED, RECRUITMENT_STATUS.DRAFT],
          },
        },
        {
          [Op.or]: [
            {
              apply_deadline: {
                [Op.gte]: today,
              },
            },
            {
              apply_deadline: null,
            },
          ],
        },
      ],
    };

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }

    if (dto.search) {
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            position_input: { [Op.like]: `%${dto.search}%` },
          },
        ],
      });
    }

    if (dto.career_ids) {
      const careerIdsArray: any = dto.career_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            career_id: { [Op.in]: careerIdsArray },
          },
        ],
      });
      // whereCondition.career_id = { [Op.in]: careerIdsArray };
    }

    if (dto.years_of_experience_ids) {
      const yearsOfExperienceIdsArray: any = dto.years_of_experience_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            years_of_experience_id: { [Op.in]: yearsOfExperienceIdsArray },
          },
        ],
      });
    }

    if (dto.professional_field_ids) {
      const professionalFieldIds: any = dto.professional_field_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            professional_field_id: { [Op.in]: professionalFieldIds },
          },
        ],
      });
    }

    if (dto.position_ids) {
      const positionIds: any = dto.position_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            position_id: { [Op.in]: positionIds },
          },
        ],
      });
    }

    if (dto.salary_range_ids) {
      const salaryRangeIds: any = dto.salary_range_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            salary_range_id: { [Op.in]: salaryRangeIds },
          },
        ],
      });
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
      {
        model: CandidateRecruitment,
        include: [
          {
            model: CandidateInformation,
            as: 'candidate_information',
            include: [{ model: User }],
          },
        ],
      },
      { model: RecruitmentRequirementFile },
      { model: SalaryRange },
    ];

    let provinceDataInclude: any = {
      model: RecruitmentRequirementProvince,
      as: 'recruitment_requirement_province',
      include: {
        model: DFProvince,
        attributes: ['id', 'name'],
      },
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
      distinct: true,
      // include: includeCountOptions,
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

    const recruitment = await this.recruitmentRequirementRepository.findAll(
      options,
    );

    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({
      data: recruitment,
      blocks: {
        status: RECRUITMENT_STATUS,
      },
      paging,
    });
  }

  async detail(id: number, candidate_information_id?: number) {
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

    if (candidate_information_id) {
      const foundCandidateRequirement =
        await this.candidateRecruitmentRepository.findAll({
          where: {
            candidate_information_id,
            recruitment_requirement_id: recruitment?.id,
          },
        });

      let files_applied: any = null;

      if (foundCandidateRequirement) {
        const foundCandidateApply = await this.candidateApplyRepository.findAll(
          {
            where: {
              candidate_information_id,
              candidate_recruitment_id: foundCandidateRequirement?.map(
                (elm) => elm.id,
              ),
            },
            include: [
              {
                model: CandidateApplyFile,
              },
            ],
          },
        );
        files_applied = foundCandidateApply?.flatMap(
          (elm) => elm?.candidate_apply_file,
        );
      }
      recruitment.dataValues.cv_files_applied = files_applied;

      //Check tin yêu thích
      const foundCandidateInformation = await CandidateInformation.findOne({
        where: {
          id: candidate_information_id,
        },
      });
      const favoriteRecruitment =
        await this.userRecruitmentFavoriteRepository.findOne({
          where: {
            user_id: foundCandidateInformation?.user_id,
            recruitment_requirement_id: recruitment.id,
          },
        });
      recruitment.dataValues.is_favorite = favoriteRecruitment ? true : false;
    }

    return sendSuccess({
      data: recruitment,
      blocks: {
        status: RECRUITMENT_STATUS,
      },
    });
  }

  async findAllApplied(
    user_id: number,
    dto: WebFilterRecruitmentByCandidateDto,
  ) {
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
          status: {
            [Op.ne]: CANDIDATE_RECRUITMENT_STATUS.PENDING_CV,
          },
        },
        attributes: [
          'id',
          'candidate_information_id',
          'recruitment_requirement_id',
          'status',
        ],
      });
    const applyRecruitmentsIds = foundApplyRecruitments?.map(
      (elm) => elm.recruitment_requirement_id,
    );

    // Tìm các tin tuyển dụng đã yêu thích
    const favoriteRecruitment =
      await this.userRecruitmentFavoriteRepository.findAll({
        where: {
          user_id,
        },
      });
    const favoriteRecruitmentIds = favoriteRecruitment?.map(
      (elm) => elm.recruitment_requirement_id,
    );

    const whereCondition: any = {
      [Op.and]: [
        {
          id: {
            [Op.in]: applyRecruitmentsIds,
          },
        },
      ],
    };

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }

    if (dto.search) {
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            position_input: { [Op.like]: `%${dto.search}%` },
          },
        ],
      });
    }

    if (dto.career_ids) {
      const careerIdsArray: any = dto.career_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            career_id: { [Op.in]: careerIdsArray },
          },
        ],
      });
      // whereCondition.career_id = { [Op.in]: careerIdsArray };
    }

    if (dto.years_of_experience_ids) {
      const yearsOfExperienceIdsArray: any = dto.years_of_experience_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            years_of_experience_id: { [Op.in]: yearsOfExperienceIdsArray },
          },
        ],
      });
    }

    if (dto.professional_field_ids) {
      const professionalFieldIds: any = dto.professional_field_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            professional_field_id: { [Op.in]: professionalFieldIds },
          },
        ],
      });
    }

    if (dto.position_ids) {
      const positionIds: any = dto.position_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            position_id: { [Op.in]: positionIds },
          },
        ],
      });
    }

    if (dto.salary_range_ids) {
      const salaryRangeIds: any = dto.salary_range_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            salary_range_id: { [Op.in]: salaryRangeIds },
          },
        ],
      });
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
      {
        model: CandidateRecruitment,
        include: [
          {
            model: CandidateInformation,
            as: 'candidate_information',
            include: [{ model: User }],
          },
        ],
      },
      { model: RecruitmentRequirementFile },
      { model: SalaryRange },
    ];

    let provinceDataInclude: any = {
      model: RecruitmentRequirementProvince,
      as: 'recruitment_requirement_province',
      include: {
        model: DFProvince,
        attributes: ['id', 'name'],
      },
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
      include: includeCountOptions,
    };

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

    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };

    //Maping các tin đã thích + các tin tuyển dụng đã ứng tuyển (đối với ứng viên)
    for (const recruitment of recruitments) {
      if (favoriteRecruitmentIds?.includes(recruitment.id)) {
        recruitment.dataValues.is_favorite = true;
      }
      if (applyRecruitmentsIds?.includes(recruitment.id)) {
        recruitment.dataValues.is_applied = true;
      } else {
        recruitment.dataValues.is_applied = false;
      }
    }

    return sendSuccess({
      data: recruitments,
      blocks: {
        status: RECRUITMENT_STATUS,
      },
      paging,
    });
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

  async saveFavoriteRecruitment(user_id: number, dto: RecruitmentIdDto) {
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
}
