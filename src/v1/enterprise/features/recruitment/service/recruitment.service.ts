// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Other dependencies
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

// Local files
import { AgeGroup } from '@models/age-group.model';
import { SalaryRange } from '@models/salary-range.model';
import { User } from '@models/user.model';
import { AgeGroupRepository } from '@repositories/age-group.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { FeeOfRecruitmentRequirementRepository } from '@repositories/fee-of-recruitment-requirement.repository';
import { GenderRepository } from '@repositories/gender.repository';
import { JobTypeRepository } from '@repositories/job-type.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { RecruitmentJobTypeRepository } from '@repositories/recruitment-job-type.repository';
import { RecruitmentRequirementFileRepository } from '@repositories/recruitment-requirement-file.repository';
import { RecruitmentRequirementHistoryRepository } from '@repositories/recruitment-requirement-history.repository';
import { RecruitmentRequirementProvinceRepository } from '@repositories/recruitment-requirement-province.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { SalaryRangeRepository } from '@repositories/salary-range.repository';
import { UserRepository } from '@repositories/user.repository';
import { YearOfExperienceRepository } from '@repositories/year-of-experience.repository';
import { configService } from '@services/config.service';
import { MailService } from '@services/mail.service';
import { NotificationService } from '@services/notification.service';
import {
  IS_ACTIVE,
  NOTIFICATION_TYPE,
  NotificationPayload,
  RECRUITMENT_STATUS,
  ROLE,
} from '@utils/constants';
import { createArrayObjectByKey } from '@utils/create-array-object-by-key';
import { convertDateTime } from '@utils/date-time';
import { generateUniqueWEPKey } from '@utils/generate-code-recruitment';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { CreateRecruitmentDto } from '../dto/create-recruitment.dto';
import { FilterRecruitmentDto } from '../dto/filter-recruitment.dto';
import { RecruitmentRequirementHro } from '@models/recruitment-requirement-hro.model';
import { RecruitmentRequirementImplementation } from '@models/recruitment-requirement-implementation.model';
import { RecruitmentJobType } from '@models/recruitment-job-type.model';
import { RecruitmentRequirementHistory } from '@models/recruitment-requirement-history.model';
import { CandidateInformation } from '@models/candidate-information.model';
import { CandidateRecruitment } from '@models/candidate-recruitment.model';
import { FeeOfRecruitmentRequirement } from '@models/fee-of-recruitment-requirement.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { RecruitmentRequirementProvince } from '@models/recruitment-requirement-province.model';
import { DFProvince } from '@models/df-province.model';
import { DFWard } from '@models/df-ward.model';
import { DFDistrict } from '@models/df-district.model';
import { EnterpriseAddress } from '@models/enterprise-address.model';
import { Enterprise } from '@models/enterprise.model';
import { RecruitmentRequirementFile } from '@models/recruitment-requirement-file.model';
import { Position } from '@models/position.model';
import { ProfessionalField } from '@models/professional-field.model';
import { FeeType } from '@models/fee-type.model';

@Injectable()
export class RecruitmentService {
  private readonly status = [
    {
      id: RECRUITMENT_STATUS.IN_PROGRESS,
      name: 'Đang xử lý',
    },
    {
      id: RECRUITMENT_STATUS.PROCESSED,
      name: 'Đã xử lý',
    },
    {
      id: RECRUITMENT_STATUS.PENDING,
      name: 'Đang chờ/ Tạo mới',
    },
    {
      id: RECRUITMENT_STATUS.REJECTED,
      name: 'Từ trối',
    },
    {
      id: RECRUITMENT_STATUS.UPDATE,
      name: 'Cập nhật',
    },
  ];

  constructor(
    private readonly professionalFieldRepository: ProfessionalFieldRepository,
    private readonly jobTypeRepository: JobTypeRepository,
    private readonly dfProvinceRepository: DFProvinceRepository,
    private readonly yearOfExperienceRepository: YearOfExperienceRepository,
    private readonly genderRepository: GenderRepository,
    private readonly ageGroupRepository: AgeGroupRepository,
    private readonly salaryRangeRepository: SalaryRangeRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly recruitmentJobTypeRepository: RecruitmentJobTypeRepository,
    private readonly recruitmentRequirementRepository: RecruitmentRequirementRepository,
    private readonly feeOfRecruitmentRequirementRepository: FeeOfRecruitmentRequirementRepository,
    private readonly recruitmentRequirementHistoryRepository: RecruitmentRequirementHistoryRepository,
    private readonly recruitmentRequirementProvinceRepository: RecruitmentRequirementProvinceRepository,
    private readonly notificationService: NotificationService,
    private readonly mailService: MailService,
    private readonly userRepository: UserRepository,
    private readonly sequelize: Sequelize,
    private readonly recruitmentRequirementFileRepository: RecruitmentRequirementFileRepository,
  ) {}

  async update(user_id: number, id: number, dto: CreateRecruitmentDto) {
    const recruitment =
      await this.recruitmentRequirementRepository.findRecruitment(id);

    if (!recruitment) {
      throw new HttpException(
        'Thông tin yêu cầu tuyển dụng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const arrRecruitmentStatus = [
      RECRUITMENT_STATUS.PROCESSED,
      RECRUITMENT_STATUS.REJECTED,
      RECRUITMENT_STATUS.COMPLETED,
    ];

    const isMatchRecruitmentStatus = arrRecruitmentStatus.find(
      (value) => recruitment.status === value,
    );

    if (isMatchRecruitmentStatus) {
      throw new HttpException(
        'Không được phép chỉnh sửa yêu cầu với các trạng thái Đang tuyển dụng, Từ chối và Hoàn thành.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const enterprise = await this.enterpriseRepository.findEnterprise(user_id);

    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    if (dto.professional_field_id) {
      const professionalField =
        await this.professionalFieldRepository.findProfessionalField(
          dto.professional_field_id,
        );

      if (!professionalField) {
        throw new HttpException(
          'Vị trí tuyển dụng không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    let cvRecruitmentJobType: any;
    if (dto.recruitment_job_type) {
      cvRecruitmentJobType = JSON.parse(dto.recruitment_job_type);

      if (
        !Array.isArray(cvRecruitmentJobType) &&
        cvRecruitmentJobType.length === 0
      ) {
        throw new HttpException(
          'Vui lòng không bỏ trống hình thức làm việc',
          HttpStatus.NOT_FOUND,
        );
      }

      const jobType: any = await this.jobTypeRepository.foundJobType(
        cvRecruitmentJobType,
      );

      if (!Array.isArray(jobType) && jobType.length === 0) {
        throw new HttpException(
          'Hình thức làm việc không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.is_all_province == IS_ACTIVE.ACTIVE) {
      if (dto.df_province && dto.df_province.length > 0) {
        throw new HttpException(
          'Vui lòng không chọn khu vực làm việc ',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (dto.df_province && dto.df_province.length > 0) {
      const province = await this.dfProvinceRepository.findAll({
        where: {
          id: { [Op.in]: dto.df_province },
        },
      });

      if (province?.length != dto.df_province.length) {
        throw new HttpException(
          'Khu vực làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.years_of_experience) {
      const yearsOfExperience =
        await this.yearOfExperienceRepository.findYearOfExperience(
          dto.years_of_experience,
        );

      if (!yearsOfExperience) {
        throw new HttpException(
          'Kinh nghiệm làm việc không tồn tại trên hệ thống',
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

    let ageGroup: null | AgeGroup = null;

    if (dto.age_group) {
      ageGroup = await this.ageGroupRepository.findAgeGroup(dto.age_group);

      if (!ageGroup) {
        throw new HttpException(
          'Nhóm độ tuổi không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    let salaryRange: null | SalaryRange = null;

    if (dto.salary_range) {
      salaryRange = await this.salaryRangeRepository.findSalaryRange(
        dto.salary_range,
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
          professional_field_id: dto.professional_field_id || null,
          enterprise_id: +enterprise.id,
          years_of_experience_id: +dto.years_of_experience || null,
          gender_id: +dto.gender_id || null,
          age_group_id: ageGroup ? +dto.age_group : null,
          salary_range_id: salaryRange ? +dto.salary_range : null,
          recruitment_count: +dto.recruitment_count || null,
          job_description: dto.job_description || null,
          enterprise_introduction: dto.enterprise_introduction || null,
          benefits_and_treatment: dto.benefits_and_treatment || null,
          created_by: user_id,
          is_all_province: dto.is_all_province,
          professional_field_input: dto.professional_field_input || null,
          work_address: dto.work_address || null,
          position_id: dto.position_id || null,
          position_input: dto.position_input || null,
          apply_deadline: dto.apply_deadline,
          career_id: dto.career_id || null,
        };

        if (dto.df_province && dto.df_province.length > 0) {
          const listIdsCreate =
            await this.recruitmentRequirementProvinceRepository.bulkDeleteProvince(
              id,
              dto.df_province,
              transaction,
            );
          await this.recruitmentRequirementProvinceRepository.bulkCreateProvince(
            id,
            listIdsCreate || [],
            transaction,
          );
        }

        await this.recruitmentRequirementFileRepository.destroy({
          where: {
            recruitment_requirement_id: recruitment.id,
          },
          transaction,
        });
        if (dto.jd && dto.jd.length > 0) {
          const dataCreated = dto.jd.map((e) => ({
            recruitment_requirement_id: recruitment.id,
            file: e.file,
            file_name: e.file_name,
          }));
          await this.recruitmentRequirementFileRepository.bulkCreate(
            dataCreated,
            { transaction },
          );
        }
        await this.recruitmentRequirementRepository.updateRecruitment(
          recruitment.id,
          payloadCreate,
          transaction,
        );
        await this.recruitmentRequirementHistoryRepository.create(
          {
            recruitment_requirement_id: recruitment.id,
            status: RECRUITMENT_STATUS.UPDATE,
            created_by: user_id,
          },
          { transaction },
        );
        if (cvRecruitmentJobType && cvRecruitmentJobType.length > 0) {
          const listDeleteCardTransferVoucher = createArrayObjectByKey(
            cvRecruitmentJobType,
            'job_type_id',
            id,
            'value',
          );

          const listIdsCreate =
            await this.recruitmentJobTypeRepository.bulkDeleteJobType(
              id,
              listDeleteCardTransferVoucher,
              transaction,
            );

          await this.recruitmentJobTypeRepository.bulkCreateJobType(
            id,
            listIdsCreate,
            transaction,
          );
        }
      },
    );
    await recruitment.reload();

    return sendSuccess({
      data: recruitment,
      msg: 'Cập nhật yêu cầu tứng tuyển thành công',
      blocks: {
        status: this.status,
      },
    });
  }

  async findAll(user_id: number, dto: FilterRecruitmentDto) {
    const options: any = {
      order: [['id', 'DESC']],
    };

    const conditions: any = {
      [Op.and]: [],
    };

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

    if (dto.search) {
      // conditions.professional_field_input = {
      //   [Op.like]: `%${dto.search || ''}%`,
      // };
      conditions.position_input = {
        [Op.like]: `%${dto.search || ''}%`,
      };
    }

    if (dto.status) {
      conditions.status = dto.status;
    }

    if (dto.from_date && dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);

      conditions.created_at = { [Op.between]: [fromDate, toDate] };
    }
    if (dto.fee_type) {
      conditions[Op.and].push({
        id: {
          [Op.in]: [
            Sequelize.literal(
              `SELECT recruitment_requirement_id FROM fee_of_recruitment_requirement
              WHERE fee_type_id = ${dto.fee_type}`,
            ),
          ],
        },
      });
    }
    const count = await this.recruitmentRequirementRepository.count({
      where: conditions,
    });

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    options.where = conditions;
    // options.include = [
    //   { model: ProfessionalField },
    //   { model: Position },
    //   { model: RecruitmentRequirementFile },
    //   {
    //     model: Enterprise,
    //     include: [
    //       { model: User, as: 'user' },
    //       {
    //         model: EnterpriseAddress,
    //         include: [
    //           {
    //             model: DFProvince,
    //           },
    //           {
    //             model: DFWard,
    //           },
    //           {
    //             model: DFDistrict,
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     model: RecruitmentRequirementProvince,
    //     include: [{ model: DFProvince }],
    //   },
    //   { model: SalaryRange },
    //   { model: YearOfExperience },
    //   { model: AgeGroup },
    //   { model: FeeOfRecruitmentRequirement, include: [{ model: FeeType }] },
    //   {
    //     model: CandidateRecruitment,
    //     include: [
    //       { model: CandidateInformation, include: [{ model: User }] },
    //       {
    //         model: User,
    //         attributes: [
    //           'avatar',
    //           'role_id',
    //           'full_name',
    //           'email',
    //           'phone_number',
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     model: RecruitmentRequirementHistory,
    //     attributes: {
    //       include: [
    //         [
    //           Sequelize.literal(
    //             `(
    //               SELECT JSON_OBJECT('full_name',full_name,'phone_number', phone_number) FROM candidate_information JOIN user ON user.id = candidate_information.user_id
    //               WHERE candidate_information.id = recruitment_requirement_history.candidate_information_id
    //               LIMIT 1
    //             )`,
    //           ),
    //           'candidate_information',
    //         ],
    //       ],
    //     },
    //     include: [
    //       {
    //         model: User,
    //         attributes: [
    //           'id',
    //           'full_name',
    //           'role_id',
    //           'avatar',
    //           'phone_number',
    //           [
    //             Sequelize.literal(
    //               `(
    //                   SELECT name FROM enterprise
    //                   WHERE user_id = recruitment_requirement_history.created_by
    //                   LIMIT 1
    //                  )`,
    //             ),
    //             'enterprise_name',
    //           ],
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     model: RecruitmentJobType,
    //   },
    //   { model: User, attributes: ['id', 'full_name'] },
    //   {
    //     model: RecruitmentRequirementImplementation,
    //     include: [
    //       {
    //         model: User,
    //         attributes: ['id', 'full_name', 'phone_number', 'email'],
    //       },
    //     ],
    //   },
    //   {
    //     model: RecruitmentRequirementHro,
    //     include: [{ model: User, attributes: ['id', 'full_name'] }],
    //   },
    // ];

    const recruitment =
      await this.recruitmentRequirementRepository.findAllRecruitment(options);

    const paging = {
      total_count,
      current_page,
      limit: dto.limit,
      offset,
    };

    return sendSuccess({
      data: recruitment,
      paging,
      blocks: {
        status: this.status,
      },
    });
  }

  async countRecruitment(user_id: number, dto: FilterRecruitmentDto) {
    const conditions: any = {
      [Op.and]: [],
    };

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

    if (dto.search) {
      conditions.code = { [Op.like]: `%${dto.search || ''}%` };
    }

    if (dto.from_date && dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);

      conditions.created_at = { [Op.between]: [fromDate, toDate] };
    }
    if (dto.fee_type) {
      conditions[Op.and].push({
        id: {
          [Op.in]: [
            Sequelize.literal(
              `SELECT recruitment_requirement_id FROM fee_of_recruitment_requirement
              WHERE fee_type_id = ${dto.fee_type}`,
            ),
          ],
        },
      });
    }
    const pendingConditions = {
      ...conditions,
      status: RECRUITMENT_STATUS.PENDING,
    };
    const pendingCount = await this.recruitmentRequirementRepository.count({
      where: pendingConditions,
    });

    const inProgressConditions = {
      ...conditions,
      status: RECRUITMENT_STATUS.IN_PROGRESS,
    };
    const inProgressCount = await this.recruitmentRequirementRepository.count({
      where: inProgressConditions,
    });

    const processedConditions = {
      ...conditions,
      status: RECRUITMENT_STATUS.PROCESSED,
    };
    const processedCount = await this.recruitmentRequirementRepository.count({
      where: processedConditions,
    });

    const rejectedConditions = {
      ...conditions,
      status: RECRUITMENT_STATUS.REJECTED,
    };
    const rejectedCount = await this.recruitmentRequirementRepository.count({
      where: rejectedConditions,
    });

    const completedConditions = {
      ...conditions,
      status: RECRUITMENT_STATUS.COMPLETED,
    };
    const completedCount = await this.recruitmentRequirementRepository.count({
      where: completedConditions,
    });

    return sendSuccess({
      data: {
        pending_count: pendingCount,
        in_progress_count: inProgressCount,
        processed_count: processedCount,
        rejected_count: rejectedCount,
        completed_count: completedCount,
      },
    });
  }

  async findOne(id: number) {
    const recruitment =
      await this.recruitmentRequirementRepository.findRecruitment(id);

    if (!recruitment) {
      throw new HttpException(
        'Yêu cầu tuyển dụng không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    return sendSuccess({ data: recruitment });
  }

  async create(user_id: number, dto: CreateRecruitmentDto) {
    const enterprise = await this.enterpriseRepository.findOne({
      where: {
        user_id,
      },
      include: {
        model: User,
        as: 'user',
      },
    });

    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    if (dto.professional_field_id) {
      const professionalField =
        await this.professionalFieldRepository.findProfessionalField(
          dto.professional_field_id,
        );

      if (!professionalField) {
        throw new HttpException(
          'Vị trí tuyển dụng không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    let cvRecruitmentJobType: any;
    if (dto.recruitment_job_type) {
      cvRecruitmentJobType = JSON.parse(dto.recruitment_job_type);

      if (
        !Array.isArray(cvRecruitmentJobType) &&
        cvRecruitmentJobType.length === 0
      ) {
        throw new HttpException(
          'Vui lòng không bỏ trống hình thức làm việc',
          HttpStatus.NOT_FOUND,
        );
      }

      const jobType: any = await this.jobTypeRepository.foundJobType(
        cvRecruitmentJobType,
      );

      if (!Array.isArray(jobType) && jobType.length === 0) {
        throw new HttpException(
          'Hình thức làm việc không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.is_all_province == IS_ACTIVE.ACTIVE) {
      if (dto.df_province && dto.df_province.length > 0) {
        throw new HttpException(
          'Vui lòng không chọn khu vực làm việc ',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (dto.df_province && dto.df_province.length > 0) {
      const province = await this.dfProvinceRepository.findAll({
        where: {
          id: { [Op.in]: dto.df_province },
        },
      });

      if (province?.length != dto.df_province.length) {
        throw new HttpException(
          'Khu vực làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.years_of_experience) {
      const yearsOfExperience =
        await this.yearOfExperienceRepository.findYearOfExperience(
          dto.years_of_experience,
        );

      if (!yearsOfExperience) {
        throw new HttpException(
          'Kinh nghiệm làm việc không tồn tại trên hệ thống',
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

    let ageGroup: null | AgeGroup = null;

    if (dto.age_group) {
      ageGroup = await this.ageGroupRepository.findAgeGroup(dto.age_group);

      if (!ageGroup) {
        throw new HttpException(
          'Nhóm độ tuổi không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    let salaryRange: null | SalaryRange = null;

    if (dto.salary_range) {
      salaryRange = await this.salaryRangeRepository.findSalaryRange(
        dto.salary_range,
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
        let status = dto?.status || RECRUITMENT_STATUS.PROCESSED;
        if (dto.is_just_jd) {
          status = RECRUITMENT_STATUS.PENDING;
        }

        const payloadCreate = {
          professional_field_id: dto.professional_field_id || null,
          enterprise_id: +enterprise.id,
          years_of_experience_id: +dto.years_of_experience || null,
          gender_id: +dto.gender_id || null,
          age_group_id: ageGroup ? +dto.age_group : null,
          salary_range_id: salaryRange ? +dto.salary_range : null,
          recruitment_count: +dto.recruitment_count || null,
          job_description: dto.job_description || null,
          enterprise_introduction: dto.enterprise_introduction || null,
          benefits_and_treatment: dto.benefits_and_treatment || null,
          status,
          created_by: user_id,
          is_all_province: dto.is_all_province,
          professional_field_input: dto.professional_field_input || null,
          created_on_mini_app: 0,
          work_address: dto.work_address || null,
          position_id: dto.position_id || null,
          position_input: dto.position_input || null,
          apply_deadline: dto.apply_deadline,
          career_id: dto.career_id || null,
          modify_date_processed:
            status === RECRUITMENT_STATUS.PROCESSED ? new Date() : null,
        };

        const recruitment =
          await this.recruitmentRequirementRepository.createRecruitment(
            payloadCreate,
            transaction,
          );

        if (dto.jd && dto.jd.length > 0) {
          const dataCreated = dto.jd.map((e) => ({
            recruitment_requirement_id: recruitment.id,
            file: e.file,
            file_name: e.file_name,
          }));
          await this.recruitmentRequirementFileRepository.bulkCreate(
            dataCreated,
            { transaction },
          );
        }
        if (dto.df_province && dto.df_province.length > 0) {
          const created = dto.df_province.map((e) => ({
            recruitment_requirement_id: recruitment.id,
            df_province_id: e,
          }));
          await this.recruitmentRequirementProvinceRepository.bulkCreate(
            created,
            { transaction },
          );
        }
        await this.recruitmentRequirementHistoryRepository.create(
          {
            recruitment_requirement_id: recruitment.id,
            status: RECRUITMENT_STATUS.PENDING,
            created_by: user_id,
          },
          { transaction },
        );
        const bulkCreate = [];
        if (cvRecruitmentJobType && cvRecruitmentJobType.length > 0) {
          for (const item of cvRecruitmentJobType) {
            bulkCreate.push({
              recruitment_requirement_id: recruitment.id,
              job_type_id: item,
            });
          }

          for (const item of bulkCreate) {
            await this.recruitmentJobTypeRepository.create(item, {
              transaction,
            });
          }
        }
        const code = generateUniqueWEPKey();

        await recruitment?.update({ code }, { transaction });

        await recruitment?.save();

        return recruitment;
      },
    );

    // Send email to enterprise
    const notificationPayload: NotificationPayload = {
      title:
        'Tạo yêu cầu tuyển dụng thành công. Nhân viên tư vấn sẽ liên hệ lại tới quý khách hàng!',
      content:
        'Tạo yêu cầu tuyển dụng thành công. Nhân viên tư vấn sẽ liên hệ lại tới quý khách hàng!',
      type: NOTIFICATION_TYPE.CREATE_RECRUITMENT_REQUIREMENT,
      data: { recruitment_id: result.id },
    };
    this.notificationService.createAndSendNotificationForUsers(
      notificationPayload,
      {
        include_user_ids: [enterprise.user_id],
      },
    );

    if (enterprise?.user?.email) {
      this.mailService.sendCreateRecruitmentToEnterprise({
        receiver_email: enterprise.user.email,
        subject: '[Alehub] Thông báo tạo yêu cầu tuyển dụng',
        text: {
          logo_url: process.env.LOGO_URL,
          recruitment_id: result.id,
          webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
        },
      });
    }

    // Send email to Admin
    const notificationPayloadToAdmin: NotificationPayload = {
      title: `Doanh nghiệp ${enterprise.name} vừa tạo yêu cầu tuyển dụng`,
      content: `Doanh nghiệp ${enterprise.name} vừa tạo yêu cầu tuyển dụng`,
      type: NOTIFICATION_TYPE.CREATE_RECRUITMENT_REQUIREMENT,
      data: { recruitment_id: result.id },
    };
    this.notificationService.createAndSendNotificationForUsers(
      notificationPayloadToAdmin,
      {
        role_id: [ROLE.ADMIN],
      },
    );
    const admins = await this.userRepository.findAll({
      where: {
        role_id: ROLE.ADMIN,
      },
    });

    if (admins && admins.length > 0) {
      const emailPromises = admins
        .filter((admin) => admin?.email) // Lọc ra những admin có email
        .map((admin) =>
          this.mailService.sendCreateRecruitmentToAdmin({
            receiver_email: admin.email,
            subject: '[Alehub] Thông báo tạo yêu cầu tuyển dụng',
            text: {
              customer_name: enterprise.user.full_name,
              enterprise_name: enterprise.name,
              recruitment_id: result.id,
              webLoginAdmin: configService.getEnv('WEB_ADMIN'),
            },
          }),
        );

      // Sử dụng Promise.all để gửi tất cả email song song
      Promise.allSettled(emailPromises).then((results) => {
        results.forEach((result) => {
          if (result.status === 'rejected') {
            console.error('Email sending failed:', result.reason);
          }
        });
        console.log('All email operations settled.');
      });
    }


    return sendSuccess({
      data: result,
      msg: 'Tạo yêu cầu tứng tuyển thành công',
      blocks: {
        status: this.status,
      },
    });
  }
}
