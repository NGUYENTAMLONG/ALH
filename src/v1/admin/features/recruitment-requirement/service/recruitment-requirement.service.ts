//Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Op, Transaction, where } from 'sequelize';
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
  CANDIDATE_RECRUITMENT_STATUS,
  IS_ACTIVE,
  NOTIFICATION_TYPE,
  NotificationPayload,
  POINT_MUTABLE_TYPE,
  POINT_TYPE,
  RECRUITMENT_STATUS,
  ROLE,
  TYPE_OF_FEE,
  USER_STATUS,
} from '@utils/constants';
import { createArrayObjectByKey } from '@utils/create-array-object-by-key';
import { convertDateTime } from '@utils/date-time';
import { generateUniqueWEPKey } from '@utils/generate-code-recruitment';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { AdminUpdateStatusRecruitmentRequirementDto } from '../dto/admin-change-status.dto';
import { AdminDeleteRecruitmentDto } from '../dto/admin-delete-recruitment.dto';
import { AdminCreateRecruitmentDto } from '../dto/create-recruitment-requirement.dto';
import { AdminFilterRecruitmentRequirementDto } from '../dto/filter-recruitment-requirement.dto';
import { UserPointRepository } from '@repositories/user-point.repository';
import { UserPointHistoryRepository } from '@repositories/user-point-history.repository';
import { ConfigPointHroRepository } from '@repositories/config-point-hro.repository';
import * as moment from 'moment';
import { adminApprovesRecruitmentTemplate } from 'src/shared/zalo-templates/templates';
import { sendZaloMessage } from '@utils/send-zalo-message';
import { CandidateApply } from '@models/candidate-apply.model';
import { CandidateApplyFile } from '@models/candidate-apply-file.model';
@Injectable()
export class AdminRecruitmentRequirementService {
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
    private readonly configPointHroRepository: ConfigPointHroRepository,
    private readonly userPointRepository: UserPointRepository,
    private readonly userPointHistoryRepository: UserPointHistoryRepository,
  ) {}

  async create(user_id: number, dto: AdminCreateRecruitmentDto) {
    const enterprise = await this.enterpriseRepository.findOne({
      where: { id: dto.enterprise_id },
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
    if (dto.responsible_sale_id) {
      const foundUser = await this.userRepository.findOne({
        where: {
          id: dto.responsible_sale_id,
          role_id: ROLE.RESPONSIBLE_SALE,
        },
      });
      if (!foundUser) {
        throw new HttpException(
          'Sale phụ trách không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.implementation_sale_ids && dto.implementation_sale_ids.length > 0) {
      const foundImplementUser = await this.userRepository.findAll({
        where: {
          id: { [Op.in]: dto.implementation_sale_ids },
          role_id: ROLE.IMPLEMENTATION_SALE,
        },
      });

      if (foundImplementUser?.length != dto.implementation_sale_ids.length) {
        throw new HttpException(
          'Sale triển khai không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto.is_all_hro == IS_ACTIVE.ACTIVE) {
      if (dto.hro_ids && dto.hro_ids.length > 0) {
        throw new HttpException(
          'Vui lòng không chọn HRO',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (dto.hro_ids && dto.hro_ids.length > 0) {
      const foundHro = await this.userRepository.findAll({
        where: {
          id: { [Op.in]: dto.hro_ids },
          role_id: ROLE.HRO,
        },
      });

      if (foundHro?.length != dto.hro_ids.length) {
        throw new HttpException(
          'HRO không tồn tại trên hệ thống',
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

    const recruitment = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        const payloadCreate = {
          position_id: dto.position_id || null,
          career_id: dto.career_field_id || null,
          position_input: dto.position_input || null,
          professional_field_id: dto.professional_field_id || null,
          enterprise_id: +enterprise.id,
          years_of_experience_id: dto.years_of_experience || null,
          gender_id: dto.gender_id || null,
          age_group_id: ageGroup ? dto.age_group : null,
          salary_range_id: salaryRange ? dto.salary_range : null,
          recruitment_count: dto.recruitment_count || null,
          job_description: dto.job_description || null,
          enterprise_introduction: dto.enterprise_introduction || null,
          benefits_and_treatment: dto.benefits_and_treatment || null,
          status: RECRUITMENT_STATUS.PENDING,
          created_by: user_id,
          is_all_province: dto.is_all_province,
          responsible_sale_id: dto.responsible_sale_id,
          professional_field_input: dto.professional_field_input || null,
          is_all_hro: dto.is_all_hro,
          created_on_mini_app: 0,
          work_address: dto.work_address || null,
          apply_deadline: dto.apply_deadline || null,
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
        if (
          dto.implementation_sale_ids &&
          dto.implementation_sale_ids.length > 0
        ) {
          const created = dto.implementation_sale_ids.map((e) => ({
            recruitment_requirement_id: recruitment.id,
            user_id: e,
          }));
          await this.recruitmentRequirementImplementationRepository.bulkCreate(
            created,
            { transaction },
          );
        }
        if (dto.is_all_hro) {
        } else if (dto.hro_ids && dto.hro_ids.length > 0) {
          const created = dto.hro_ids.map((e) => ({
            recruitment_requirement_id: recruitment.id,
            user_id: e,
          }));
          await this.recruitmentRequirementHroRepository.bulkCreate(created, {
            transaction,
          });
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

        if (dto.fee_type_id) {
          await this.feeOfRecruitmentRequirementRepository.create(
            {
              fee_type_id: dto.fee_type_id,
              recruitment_requirement_id: recruitment.id,
              professional_field_id: dto.professional_field_id,
              price: dto.price || 0,
              type: TYPE_OF_FEE.ENTERPRISE,
            },
            { transaction },
          );
          await this.feeOfRecruitmentRequirementRepository.create(
            {
              fee_type_id: dto.fee_type_id,
              recruitment_requirement_id: recruitment.id,
              professional_field_id: dto.professional_field_id,
              price: dto.hro_price || 0,
              type: TYPE_OF_FEE.HRO,
            },
            { transaction },
          );
        }
        const code = generateUniqueWEPKey();

        await recruitment?.update({ code }, { transaction });

        await recruitment?.save();

        return recruitment;
      },
    );

    const emailPromises = [];
    if (dto.implementation_sale_ids && dto.implementation_sale_ids.length > 0) {
      for (let i = 0; i < dto.implementation_sale_ids.length; i++) {
        const foundImplementUser = await this.userRepository.findOne({
          where: {
            id: dto.implementation_sale_ids[i],
          },
        });
        if (!foundImplementUser) {
          throw new HttpException(
            'Sale triển khai không tồn tại trên hệ thống',
            HttpStatus.NOT_FOUND,
          );
        }
        const notificationPayload: NotificationPayload = {
          title: `Bạn vừa được gán vào yêu cầu tuyển dụng ${recruitment.code}`,
          content: `Bạn vừa được gán vào yêu cầu tuyển dụng ${recruitment.code}`,
          type: NOTIFICATION_TYPE.ADD_IMPLEMENT_SALE,
          data: { recruitment_id: recruitment.id },
        };
        this.notificationService.createAndSendNotificationForUsers(
          notificationPayload,
          {
            include_user_ids: [foundImplementUser.id],
          },
        );
        if (foundImplementUser?.email) {
          emailPromises.push(
            this.mailService.sendUpdateImplementSaleRecruitmentToUser({
              receiver_email: foundImplementUser.email,
              subject: `[Alehub] Thông báo giao việc`,
              text: {
                logo_url: process.env.LOGO_URL,
                enterprise_name: enterprise.name,
                recruitment_code: recruitment.code,
                recruitment_id: recruitment.id,
                webLoginAdmin: configService.getEnv('WEB_ADMIN'),
              },
            }),
          );
        }
      }
    }

    if (dto.responsible_sale_id) {
      const foundUser = await this.userRepository.findOne({
        where: {
          id: dto.responsible_sale_id,
          role_id: ROLE.RESPONSIBLE_SALE,
        },
      });
      if (!foundUser) {
        throw new HttpException(
          'Sale phụ trách không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
      const notificationPayload: NotificationPayload = {
        title: `Bạn vừa được giao phụ trách yêu cầu tuyển dụng ${recruitment.code}`,
        content: `Bạn vừa được giao phụ trách yêu cầu tuyển dụng ${recruitment.code}`,
        type: NOTIFICATION_TYPE.ADD_RESPONSIBLE_SALE,
        data: { recruitment_id: recruitment.id },
      };
      this.notificationService.createAndSendNotificationForUsers(
        notificationPayload,
        {
          include_user_ids: [foundUser.id],
        },
      );
      if (foundUser?.email) {
        emailPromises.push(
          this.mailService.sendUpdateResponsibleSaleRecruitmentToUser({
            receiver_email: foundUser.email,
            subject: `[Alehub] Thông báo giao việc`,
            text: {
              logo_url: process.env.LOGO_URL,
              enterprise_name: enterprise.name,
              recruitment_code: recruitment.code,
              recruitment_id: recruitment.id,
              webLoginAdmin: configService.getEnv('WEB_ADMIN'),
            },
          }),
        );
      }
    }
    if (dto.is_all_hro) {
      const foundHroUser = await this.userRepository.findAll({
        where: {
          role_id: ROLE.HRO,
          status: USER_STATUS.ACTIVE,
        },
      });
      if (foundHroUser && foundHroUser.length > 0) {
        const userIDs = foundHroUser.map((e) => e.id);
        const notificationPayload: NotificationPayload = {
          title: `Bạn vừa nhận được một yêu cầu tuyển dụng mới`,
          content: `Bạn vừa nhận được một yêu cầu tuyển dụng mới`,
          type: NOTIFICATION_TYPE.ADD_HRO,
          data: { recruitment_id: recruitment.id },
        };
        this.notificationService.createAndSendNotificationForUsers(
          notificationPayload,
          {
            include_user_ids: userIDs,
          },
        );
        for (let i = 0; i < foundHroUser.length; i++) {
          if (foundHroUser[i]?.email) {
            emailPromises.push(
              this.mailService.adminAddHROInRecruitmentToHRO({
                receiver_email: foundHroUser[i].email,
                subject: `[Alehub] Bạn có một yêu cầu tuyển dụng mới`,
                text: {
                  logo_url: configService.getEnv('LOGO_URL'),
                  enterprise_name: enterprise.name,
                  position: recruitment.professional_field_input,
                  webLoginAdmin: configService.getEnv('WEB_ADMIN'),
                  recruitment_id: recruitment.id,
                },
              }),
            );
          }
        }
      }
    } else if (dto.hro_ids && dto.hro_ids.length > 0) {
      for (let i = 0; i < dto.hro_ids.length; i++) {
        const foundHroUser = await this.userRepository.findOne({
          where: {
            id: dto.hro_ids[i],
          },
        });
        if (!foundHroUser) {
          throw new HttpException(
            'HRO không tồn tại trên hệ thống',
            HttpStatus.NOT_FOUND,
          );
        }
        const notificationPayload: NotificationPayload = {
          title: `Bạn vừa nhận được một yêu cầu tuyển dụng mới`,
          content: `Bạn vừa nhận được một yêu cầu tuyển dụng mới`,
          type: NOTIFICATION_TYPE.ADD_HRO,
          data: { recruitment_id: recruitment.id },
        };
        this.notificationService.createAndSendNotificationForUsers(
          notificationPayload,
          {
            include_user_ids: [foundHroUser.id],
          },
        );
        if (foundHroUser?.email) {
          emailPromises.push(
            this.mailService.adminAddHROInRecruitmentToHRO({
              receiver_email: foundHroUser.email,
              subject: `[Alehub] Bạn có một yêu cầu tuyển dụng mới`,
              text: {
                logo_url: configService.getEnv('LOGO_URL'),
                enterprise_name: enterprise.name,
                position: recruitment.professional_field_input,
                webLoginAdmin: configService.getEnv('WEB_ADMIN'),
                recruitment_id: recruitment.id,
              },
            }),
          );
        }
      }
    }

    Promise.allSettled(emailPromises).then((results) => {
      results.forEach((result) => {
        if (result.status === 'rejected') {
          console.error('Email sending failed:', result.reason);
        }
      });
      console.log('All email operations settled.');
    });

    return sendSuccess({ data: recruitment });
  }

  async update(id: number, user_id: number, dto: AdminCreateRecruitmentDto) {
    const recruitment =
      await this.recruitmentRequirementRepository.findRecruitment(id);

    if (!recruitment) {
      throw new HttpException(
        'Thông tin yêu cầu tuyển dụng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const arrRecruitmentStatus = [
      RECRUITMENT_STATUS.REJECTED,
      RECRUITMENT_STATUS.COMPLETED,
    ];

    const isMatchRecruitmentStatus = arrRecruitmentStatus.find(
      (value) => recruitment.status === value,
    );

    if (isMatchRecruitmentStatus) {
      throw new HttpException(
        'Không được phép chỉnh sửa yêu cầu với các trạng thái Từ chối và Hoàn thành.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const enterprise = await this.enterpriseRepository.findOne({
      where: { id: dto.enterprise_id },
      include: { model: User, as: 'user' },
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

    if (dto.responsible_sale_id) {
      const foundUser = await this.userRepository.findOne({
        where: {
          id: dto.responsible_sale_id,
          role_id: ROLE.RESPONSIBLE_SALE,
        },
      });
      if (!foundUser) {
        throw new HttpException(
          'Sale phụ trách không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.implementation_sale_ids && dto.implementation_sale_ids.length > 0) {
      const foundImplementUser = await this.userRepository.findAll({
        where: {
          id: { [Op.in]: dto.implementation_sale_ids },
          role_id: ROLE.IMPLEMENTATION_SALE,
        },
      });

      if (foundImplementUser?.length != dto.implementation_sale_ids.length) {
        throw new HttpException(
          'Sale triển khai không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.is_all_hro == IS_ACTIVE.ACTIVE) {
      if (dto.hro_ids && dto.hro_ids.length > 0) {
        throw new HttpException(
          'Vui lòng không chọn HRO',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (dto.hro_ids && dto.hro_ids.length > 0) {
      const foundHro = await this.userRepository.findAll({
        where: {
          id: { [Op.in]: dto.hro_ids },
          role_id: ROLE.HRO,
        },
      });

      if (foundHro?.length != dto.hro_ids.length) {
        throw new HttpException(
          'HRO không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    //Check chặn thay đổi trạng thái của yêu cầu tuyển dụng khi đang ở trạng thái đang tuyển dụng đối sang chờ tiếp nhận và đã tiếp nhận
    const statusPrevent = [
      RECRUITMENT_STATUS.PENDING,
      RECRUITMENT_STATUS.IN_PROGRESS,
    ];
    if (
      recruitment.status === RECRUITMENT_STATUS.PROCESSED &&
      statusPrevent.includes(dto.status)
    ) {
      throw new HttpException(
        'Trạng thái đang tuyển dụng không thể chuyển trạng thái chờ tiếp nhận hoặc đã tiếp nhận',
        HttpStatus.AMBIGUOUS,
      );
    }

    await this.sequelize.transaction(async (transaction: Transaction) => {
      const payloadUpdate = {
        position_input: dto.position_input || null,
        professional_field_id: dto.professional_field_id || null,
        enterprise_id: +enterprise.id,
        years_of_experience_id: dto.years_of_experience || null,
        gender_id: dto.gender_id || null,
        age_group_id: ageGroup ? +dto.age_group : null,
        salary_range_id: salaryRange ? +dto.salary_range : null,
        recruitment_count: +dto.recruitment_count || null,
        job_description: dto.job_description || null,
        enterprise_introduction: dto.enterprise_introduction || null,
        benefits_and_treatment: dto.benefits_and_treatment || null,
        status: dto.status,
        is_all_province: dto.is_all_province || null,
        responsible_sale_id: dto.responsible_sale_id || null,
        professional_field_input: dto.professional_field_input || null,
        position_id: dto.position_id || null,
        career_id: dto.career_field_id || null,
        is_all_hro: dto.is_all_hro,
        work_address: dto.work_address || null,
        modify_date_processed:
          dto.status === RECRUITMENT_STATUS.PROCESSED ? new Date() : null,
        apply_deadline: dto.apply_deadline || null,
      };
      if (dto.is_all_province == IS_ACTIVE.ACTIVE) {
        await this.recruitmentRequirementProvinceRepository.destroy({
          where: {
            recruitment_requirement_id: recruitment.id,
          },
          transaction,
        });
      } else if (dto.df_province && dto.df_province.length > 0) {
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

      if (dto.is_all_hro == IS_ACTIVE.ACTIVE) {
        await this.recruitmentRequirementHroRepository.destroy({
          where: {
            recruitment_requirement_id: recruitment.id,
          },
          transaction,
        });

        const foundHroUser = await this.userRepository.findAll({
          where: {
            role_id: ROLE.HRO,
            status: USER_STATUS.ACTIVE,
          },
        });
        if (foundHroUser && foundHroUser.length > 0) {
          const userIDs = foundHroUser.map((e) => e.id);
          const notificationPayload: NotificationPayload = {
            title: `Bạn vừa nhận được một yêu cầu tuyển dụng mới`,
            content: `Bạn vừa nhận được một yêu cầu tuyển dụng mới`,
            type: NOTIFICATION_TYPE.ADD_HRO,
            data: { recruitment_id: recruitment.id },
          };
          this.notificationService.createAndSendNotificationForUsers(
            notificationPayload,
            {
              include_user_ids: userIDs,
            },
          );
          for (let i = 0; i < foundHroUser.length; i++) {
            if (foundHroUser[i]?.email) {
              this.mailService.adminAddHROInRecruitmentToHRO({
                receiver_email: foundHroUser[i].email,
                subject: `[Alehub] Bạn có một yêu cầu tuyển dụng mới`,
                text: {
                  logo_url: configService.getEnv('LOGO_URL'),
                  enterprise_name: enterprise.name,
                  position: recruitment.professional_field_input,
                  webLoginAdmin: configService.getEnv('WEB_ADMIN'),
                  recruitment_id: recruitment.id,
                },
              });
            }
          }
        }
      }
      if (dto.hro_ids) {
        const listIdsCreate =
          await this.recruitmentRequirementHroRepository.bulkDeleteHro(
            id,
            dto.hro_ids,
            transaction,
          );
        const dataCreated =
          await this.recruitmentRequirementHroRepository.bulkCreateHro(
            id,
            listIdsCreate || [],
            transaction,
          );

        if (dataCreated && dataCreated.length > 0) {
          for (let i = 0; i < dataCreated.length; i++) {
            const foundHroUser = await this.userRepository.findOne({
              where: {
                id: dataCreated[i].user_id,
              },
            });
            if (!foundHroUser) {
              throw new HttpException(
                'HRO không tồn tại trên hệ thống',
                HttpStatus.NOT_FOUND,
              );
            }
            const notificationPayload: NotificationPayload = {
              title: `Bạn vừa nhận được một yêu cầu tuyển dụng mới`,
              content: `Bạn vừa nhận được một yêu cầu tuyển dụng mới`,
              type: NOTIFICATION_TYPE.ADD_HRO,
              data: { recruitment_id: recruitment.id },
            };
            this.notificationService.createAndSendNotificationForUsers(
              notificationPayload,
              {
                include_user_ids: [dataCreated[i].user_id],
              },
            );
            if (foundHroUser?.email) {
              this.mailService.adminAddHROInRecruitmentToHRO({
                receiver_email: foundHroUser.email,
                subject: `[Alehub] Bạn có một yêu cầu tuyển dụng mới`,
                text: {
                  logo_url: configService.getEnv('LOGO_URL'),
                  enterprise_name: enterprise.name,
                  position: recruitment.professional_field_input,
                  webLoginAdmin: configService.getEnv('WEB_ADMIN'),
                  recruitment_id: recruitment.id,
                },
              });
            }
          }
        }
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
      if (dto.implementation_sale_ids) {
        const listIdsCreate =
          await this.recruitmentRequirementImplementationRepository.bulkDeleteImplementation(
            id,
            dto.implementation_sale_ids,
            transaction,
          );
        const dataCreated =
          await this.recruitmentRequirementImplementationRepository.bulkCreateImplementation(
            id,
            listIdsCreate || [],
            transaction,
          );
        if (dataCreated && dataCreated.length > 0) {
          for (let i = 0; i < dataCreated.length; i++) {
            const foundImplementUser = await this.userRepository.findOne({
              where: {
                id: dataCreated[i].user_id,
              },
            });
            if (!foundImplementUser) {
              throw new HttpException(
                'Sale triển khai không tồn tại trên hệ thống',
                HttpStatus.NOT_FOUND,
              );
            }
            const notificationPayload: NotificationPayload = {
              title: `Bạn vừa được gán vào yêu cầu tuyển dụng ${recruitment.code}`,
              content: `Bạn vừa được gán vào yêu cầu tuyển dụng ${recruitment.code}`,
              type: NOTIFICATION_TYPE.ADD_IMPLEMENT_SALE,
              data: { recruitment_id: recruitment.id },
            };
            this.notificationService.createAndSendNotificationForUsers(
              notificationPayload,
              {
                include_user_ids: [dataCreated[i].user_id],
              },
            );
            if (foundImplementUser?.email) {
              this.mailService.sendUpdateImplementSaleRecruitmentToUser({
                receiver_email: foundImplementUser.email,
                subject: `[Alehub] Thông báo giao việc`,
                text: {
                  logo_url: process.env.LOGO_URL,
                  enterprise_name: enterprise.name,
                  recruitment_code: recruitment.code,
                  recruitment_id: recruitment.id,
                  webLoginAdmin: configService.getEnv('WEB_ADMIN'),
                },
              });
            }
          }
        }
      }

      await this.recruitmentRequirementRepository.updateRecruitment(
        recruitment.id,
        payloadUpdate,
        transaction,
      );
      let statusUpdated = RECRUITMENT_STATUS.UPDATE;
      if (dto.status != recruitment.status) {
        statusUpdated = dto.status;
        if (dto.status == RECRUITMENT_STATUS.IN_PROGRESS) {
          const notificationPayload: NotificationPayload = {
            title: `Yêu cầu tuyển dụng ${recruitment.code} đã được tiếp nhận`,
            content: `Yêu cầu tuyển dụng ${recruitment.code} đã được tiếp nhận`,
            type: NOTIFICATION_TYPE.UPDATE_RECRUITMENT_REQUIREMENT_STATUS,
            data: { recruitment_id: recruitment.id },
          };
          this.notificationService.createAndSendNotificationForUsers(
            notificationPayload,
            {
              include_user_ids: [enterprise.user_id],
            },
          );
          if (enterprise?.user?.email) {
            this.mailService.sendUpdateInProgressRecruitmentToEnterprise({
              receiver_email: enterprise.user.email,
              subject: `[Alehub] Thông báo yêu cầu tuyển dụng ${recruitment.code} được cập nhật thành Đã tiếp nhận `,
              text: {
                logo_url: process.env.LOGO_URL,
                enterprise_name: enterprise.name,
                recruitment_code: recruitment.code,
                recruitment_id: recruitment.id,
                webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
              },
            });
          }
        } else if (dto.status == RECRUITMENT_STATUS.PROCESSED) {
          const notificationPayload: NotificationPayload = {
            title: `Yêu cầu tuyển dụng ${recruitment.code} đang tuyển dụng`,
            content: `Yêu cầu tuyển dụng ${recruitment.code} đang tuyển dụng`,
            type: NOTIFICATION_TYPE.UPDATE_RECRUITMENT_REQUIREMENT_STATUS,
            data: { recruitment_id: recruitment.id },
          };
          this.notificationService.createAndSendNotificationForUsers(
            notificationPayload,
            {
              include_user_ids: [enterprise.user_id],
            },
          );
          if (enterprise?.user?.email) {
            this.mailService.sendUpdateProcessedRecruitmentToEnterprise({
              receiver_email: enterprise.user.email,
              subject: `[Alehub] Thông báo yêu cầu tuyển dụng ${recruitment.code} được cập nhật thành Đang tuyển dụng`,
              text: {
                logo_url: process.env.LOGO_URL,
                enterprise_name: enterprise.name,
                recruitment_code: recruitment.code,
                recruitment_id: recruitment.id,
                webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
              },
            });
          }

          //Cộng điểm HRO
          const foundHRO = await this.userRepository.findOne({
            where: {
              id: recruitment.created_by,
              role_id: ROLE.HRO,
              status: IS_ACTIVE.ACTIVE,
            },
          });
          if (foundHRO) {
            const foundUserPoint: any = await this.userPointRepository.findOne({
              where: { user_id: foundHRO.id },
            });
            const foundConfigPoint: any =
              await this.configPointHroRepository.findAll();
            const finalPoint =
              Number(foundUserPoint.point) + Number(foundConfigPoint[0].point);

            await this.userPointRepository.update(
              {
                point: finalPoint,
              },
              {
                where: { user_id: foundHRO.id },
                transaction,
              },
            );

            await this.userPointHistoryRepository.create(
              {
                user_point_id: foundUserPoint.id,
                type: POINT_TYPE.SUB,
                value: foundConfigPoint[0].point,
                current_point: finalPoint,
                mutable_type: POINT_MUTABLE_TYPE.ADD_UPDATE,
                created_by: user_id,
                // note: dto.note || null,
              },
              { transaction },
            );
            //Gửi tin nhắn zalo tới HR (người đã tạo tin tuyển dụng)
            if (foundHRO && foundHRO?.phone_number) {
              const message = adminApprovesRecruitmentTemplate(
                foundHRO.full_name,
                recruitment.position_input,
                `https://zalo.me/s/1312390836269348201/detailjob/${recruitment.id}?type=2`,
                foundConfigPoint[0].point,
                'https://zalo.me/s/1312390836269348201/historypoint?type=3',
              );
              await sendZaloMessage({
                messages: [
                  {
                    phone: foundHRO?.phone_number,
                    name: foundHRO?.full_name,
                    message: message,
                  },
                ],
              });
            }
          }
        } else if (dto.status == RECRUITMENT_STATUS.COMPLETED) {
          const notificationPayload: NotificationPayload = {
            title: `Trạng thái yêu cầu ${recruitment.code} đã chuyển hoàn thành`,
            content: `Trạng thái yêu cầu ${recruitment.code} đã chuyển hoàn thành`,
            type: NOTIFICATION_TYPE.UPDATE_RECRUITMENT_REQUIREMENT_STATUS,
            data: { recruitment_id: recruitment.id },
          };
          this.notificationService.createAndSendNotificationForUsers(
            notificationPayload,
            {
              include_user_ids: [enterprise.user_id],
            },
          );
          if (enterprise?.user?.email) {
            this.mailService.sendUpdateCompletedRecruitmentToEnterprise({
              receiver_email: enterprise.user.email,
              subject: `[Alehub] Thông báo yêu cầu tuyển dụng ${recruitment.code} được cập nhật thành Hoàn thành`,
              text: {
                logo_url: process.env.LOGO_URL,
                enterprise_name: enterprise.name,
                recruitment_code: recruitment.code,
                recruitment_id: recruitment.id,
                webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
              },
            });
          }
        } else if (dto.status == RECRUITMENT_STATUS.REJECTED) {
          //Trừ điểm HRO
          const foundHRO = await this.userRepository.findOne({
            where: {
              created_by: recruitment.created_by,
              role_id: ROLE.HRO,
              status: IS_ACTIVE.ACTIVE,
            },
          });
          if (foundHRO) {
            const foundUserPoint: any = await this.userPointRepository.findOne({
              where: { user_id: foundHRO.id },
            });
            const foundConfigPoint: any =
              await this.configPointHroRepository.findAll();
            const finalPoint =
              Number(foundUserPoint.point) - Number(foundConfigPoint[0].point);

            await this.userPointRepository.update(
              {
                point: finalPoint > 0 ? finalPoint : 0,
              },
              {
                where: { user_id: foundHRO.id },
                transaction,
              },
            );

            await this.userPointHistoryRepository.create(
              {
                user_point_id: foundUserPoint.id,
                type: POINT_TYPE.SUB,
                value: foundConfigPoint[0].point,
                current_point: finalPoint > 0 ? finalPoint : 0,
                mutable_type: POINT_MUTABLE_TYPE.SUB_UPDATE,
                created_by: user_id,
                // note: dto.note || null,
              },
              { transaction },
            );
          }
          //Gửi mail
          const notificationPayload: NotificationPayload = {
            title: `Yêu cầu ${recruitment.code} đã bị từ chối`,
            content: `Yêu cầu ${recruitment.code} đã bị từ chối`,
            type: NOTIFICATION_TYPE.UPDATE_RECRUITMENT_REQUIREMENT_STATUS,
            data: { recruitment_id: recruitment.id },
          };
          this.notificationService.createAndSendNotificationForUsers(
            notificationPayload,
            {
              include_user_ids: [enterprise.user_id],
            },
          );
          if (enterprise?.user?.email) {
            this.mailService.sendUpdateRejectRecruitmentToEnterprise({
              receiver_email: enterprise.user.email,
              subject: `[Alehub] Thông báo yêu cầu tuyển dụng ${recruitment.code} được cập nhật thành Từ chối`,
              text: {
                logo_url: process.env.LOGO_URL,
                enterprise_name: enterprise.name,
                recruitment_code: recruitment.code,
                recruitment_id: recruitment.id,
                webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
              },
            });
          }
        }
      }
      if (
        dto.responsible_sale_id &&
        dto.responsible_sale_id != recruitment.responsible_sale_id
      ) {
        const foundUser = await this.userRepository.findOne({
          where: {
            id: dto.responsible_sale_id,
            role_id: ROLE.RESPONSIBLE_SALE,
          },
        });
        if (!foundUser) {
          throw new HttpException(
            'Sale phụ trách không tồn tại',
            HttpStatus.NOT_FOUND,
          );
        }
        const notificationPayload: NotificationPayload = {
          title: `Bạn vừa được giao phụ trách yêu cầu tuyển dụng ${recruitment.code}`,
          content: `Bạn vừa được giao phụ trách yêu cầu tuyển dụng ${recruitment.code}`,
          type: NOTIFICATION_TYPE.ADD_RESPONSIBLE_SALE,
          data: { recruitment_id: recruitment.id },
        };
        this.notificationService.createAndSendNotificationForUsers(
          notificationPayload,
          {
            include_user_ids: [foundUser.id],
          },
        );
        if (foundUser?.email) {
          this.mailService.sendUpdateResponsibleSaleRecruitmentToUser({
            receiver_email: foundUser.email,
            subject: `[Alehub] Thông báo giao việc`,
            text: {
              logo_url: process.env.LOGO_URL,
              enterprise_name: enterprise.name,
              recruitment_code: recruitment.code,
              recruitment_id: recruitment.id,
              webLoginAdmin: configService.getEnv('WEB_ADMIN'),
            },
          });
        }
      }
      await this.recruitmentRequirementHistoryRepository.create(
        {
          recruitment_requirement_id: recruitment.id,
          status: statusUpdated,
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

      if (dto.fee_type_id) {
        const fee = await this.feeOfRecruitmentRequirementRepository.findOne({
          where: {
            recruitment_requirement_id: recruitment.id,
            type: TYPE_OF_FEE.ENTERPRISE,
          },
        });
        if (!fee) {
          await this.feeOfRecruitmentRequirementRepository.create(
            {
              fee_type_id: dto.fee_type_id,
              recruitment_requirement_id: recruitment.id,
              professional_field_id: dto.professional_field_id,
              price: dto.price || 0,
              type: TYPE_OF_FEE.ENTERPRISE,
            },
            { transaction },
          );
        } else {
          await fee.update(
            {
              fee_type_id: dto.fee_type_id,
              recruitment_requirement_id: recruitment.id,
              professional_field_id: dto.professional_field_id,
              price: dto.price || 0,
            },
            { transaction },
          );
        }
        const foundHroFee =
          await this.feeOfRecruitmentRequirementRepository.findOne({
            where: {
              recruitment_requirement_id: recruitment.id,
              type: TYPE_OF_FEE.HRO,
            },
          });
        if (!foundHroFee) {
          await this.feeOfRecruitmentRequirementRepository.create(
            {
              fee_type_id: dto.fee_type_id,
              recruitment_requirement_id: recruitment.id,
              professional_field_id: dto.professional_field_id,
              price: dto.hro_price || 0,
              type: TYPE_OF_FEE.HRO,
            },
            { transaction },
          );
        } else {
          await foundHroFee.update(
            {
              fee_type_id: dto.fee_type_id,
              recruitment_requirement_id: recruitment.id,
              professional_field_id: dto.professional_field_id,
              price: dto.hro_price || 0,
            },
            { transaction },
          );
        }
      }
    });
    // const notificationPayload: NotificationPayload = {
    //   title: 'Admin cập nhật yêu cầu tuyển dụng',
    //   content: `Admin cập nhật yêu cầu tuyển dụng ${recruitment.code}`,
    //   type: NOTIFICATION_TYPE.RECRUITMENT,
    //   data: { recruitment_id: recruitment.id },
    // };
    // this.notificationService.createAndSendNotificationForUsers(
    //   notificationPayload,
    //   {
    //     include_user_ids: [enterprise.user_id],
    //   },
    // );

    // this.mailService.sendUpdateRecruitmentToEnterprise({
    //   receiver_email: enterprise.user.email,
    //   subject: '[AleHub] Admin cập nhật yêu cầu tuyển dụng',
    //   text: {
    //     recruitment_code: recruitment.code,
    //     webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
    //   },
    // });

    await recruitment?.reload();

    return sendSuccess({ data: recruitment });
  }
  async findAll(user_id: number, dto: AdminFilterRecruitmentRequirementDto) {
    const foundUser = await this.userRepository.findByPk(user_id);
    if (!foundUser) {
      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    let whereCondition: any = { [Op.and]: [] };
    if (foundUser.role_id == ROLE.RESPONSIBLE_SALE) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { responsible_sale_id: user_id },
          {
            created_by: user_id,
          },
        ],
      };
    } else if (foundUser.role_id == ROLE.IMPLEMENTATION_SALE) {
      const foundImplementations =
        await this.recruitmentRequirementImplementationRepository.findAll({
          where: {
            user_id,
          },
        });
      let listID: number[] = [];
      if (foundImplementations && foundImplementations.length > 0) {
        listID = foundImplementations.map((e) => e.recruitment_requirement_id);
      }
      whereCondition[Op.and].push({
        id: {
          [Op.in]: listID,
        },
      });
    } else if (foundUser.role_id == ROLE.HRO) {
      const foundRecruitmentRequirementHro =
        await this.recruitmentRequirementHroRepository.findAll({
          where: {
            user_id,
          },
        });
      let listID: number[] = [];
      if (
        foundRecruitmentRequirementHro &&
        foundRecruitmentRequirementHro.length > 0
      ) {
        listID = foundRecruitmentRequirementHro.map(
          (e) => e.recruitment_requirement_id,
        );
      }
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            id: {
              [Op.in]: listID,
            },
          },
          {
            is_all_hro: IS_ACTIVE.ACTIVE,
          },
        ],
      });
    }
    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }
    if (dto.apply_deadline_from_date || dto.apply_deadline_to_date) {
      const { fromDate, toDate } = convertDateTime(
        dto.apply_deadline_from_date,
        dto.apply_deadline_to_date,
      );
      whereCondition.apply_deadline = { [Op.between]: [fromDate, toDate] };
    }
    if (dto.status) {
      const statusArr = dto.status.split(',');
      whereCondition.status = { [Op.in]: statusArr };
      if (statusArr.includes(RECRUITMENT_STATUS.OVERDUE.toString())) {
        const today = moment().startOf('day').toDate();
        whereCondition.apply_deadline = {
          [Op.lt]: today, // So sánh apply_deadline với ngày hôm nay
        };
      }
    }
    if (dto.responsible_sale_ids) {
      const foundEnterprises = await this.enterpriseRepository.findAll({
        where: {
          responsible_sale_id: { [Op.in]: dto.responsible_sale_ids.split(',') },
        },
      });
      if (foundEnterprises && foundEnterprises.length > 0) {
        whereCondition[Op.and].push({
          enterprise_id: {
            [Op.in]: foundEnterprises.map((e) => e.id),
          },
        });
      } else {
        whereCondition[Op.and].push({
          enterprise_id: 0,
        });
      }
    }

    if (dto.search) {
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            enterprise_id: {
              [Op.in]: [
                Sequelize.literal(
                  `SELECT enterprise.id FROM enterprise JOIN user ON user.id = enterprise.user_id
                  WHERE enterprise.name LIKE '%${dto.search}%'
                  OR user.full_name LIKE '%${dto.search}%' OR user.email LIKE '%${dto.search}%' OR user.phone_number LIKE '%${dto.search}%' `,
                ),
              ],
            },
          },
          {
            position_input: { [Op.like]: `%${dto.search}%` },
          },
          {
            code: { [Op.like]: `%${dto.search}%` },
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

    const options: any = {
      where: whereCondition,
      attributes: {
        include: [
          [
            this.sequelize.literal(
              `(
          SELECT COUNT( DISTINCT candidate_information_id) FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          ${
            foundUser.role_id == ROLE.HRO
              ? `AND candidate_information.created_by = ${foundUser.id}`
              : ''
          }
          LIMIT 1
         )`,
            ),
            'candidate_count',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${
            CANDIDATE_RECRUITMENT_STATUS.PENDING
          })) as data FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          ${
            foundUser.role_id == ROLE.HRO
              ? `AND candidate_information.created_by = ${foundUser.id}`
              : ''
          }
          AND candidate_recruitment.status = ${
            CANDIDATE_RECRUITMENT_STATUS.PENDING
          }
          LIMIT 1
         )`,
            ),
            'candidate_pending',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${
            CANDIDATE_RECRUITMENT_STATUS.APPROVE_CV
          })) as data FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          ${
            foundUser.role_id == ROLE.HRO
              ? `AND candidate_information.created_by = ${foundUser.id}`
              : ''
          }
          AND candidate_recruitment.status = ${
            CANDIDATE_RECRUITMENT_STATUS.APPROVE_CV
          }
         )`,
            ),
            'candidate_approve_cv',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${
            CANDIDATE_RECRUITMENT_STATUS.REJECT_CV
          })) as data FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          ${
            foundUser.role_id == ROLE.HRO
              ? `AND candidate_information.created_by = ${foundUser.id}`
              : ''
          }
          AND candidate_recruitment.status = ${
            CANDIDATE_RECRUITMENT_STATUS.REJECT_CV
          }
         )`,
            ),
            'candidate_reject_cv',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${
            CANDIDATE_RECRUITMENT_STATUS.SCHEDULE_INTERVIEW
          })) as data FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          ${
            foundUser.role_id == ROLE.HRO
              ? `AND candidate_information.created_by = ${foundUser.id}`
              : ''
          }
          AND candidate_recruitment.status = ${
            CANDIDATE_RECRUITMENT_STATUS.SCHEDULE_INTERVIEW
          }
         )`,
            ),
            'candidate_schedule_interview',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${
            CANDIDATE_RECRUITMENT_STATUS.RE_SCHEDULE_INTERVIEW
          })) as data FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          ${
            foundUser.role_id == ROLE.HRO
              ? `AND candidate_information.created_by = ${foundUser.id}`
              : ''
          }
          AND candidate_recruitment.status = ${
            CANDIDATE_RECRUITMENT_STATUS.RE_SCHEDULE_INTERVIEW
          }
         )`,
            ),
            'candidate_re_schedule_interview',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${
            CANDIDATE_RECRUITMENT_STATUS.SUCCESSFUL_INTERVIEW
          })) as data FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          ${
            foundUser.role_id == ROLE.HRO
              ? `AND candidate_information.created_by = ${foundUser.id}`
              : ''
          }
          AND candidate_recruitment.status = ${
            CANDIDATE_RECRUITMENT_STATUS.SUCCESSFUL_INTERVIEW
          }
         )`,
            ),
            'candidate_success_interview',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${
            CANDIDATE_RECRUITMENT_STATUS.FAIL_INTERVIEW
          })) as data FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          ${
            foundUser.role_id == ROLE.HRO
              ? `AND candidate_information.created_by = ${foundUser.id}`
              : ''
          }
          AND candidate_recruitment.status = ${
            CANDIDATE_RECRUITMENT_STATUS.FAIL_INTERVIEW
          }
         )`,
            ),
            'candidate_false_interview',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${
            CANDIDATE_RECRUITMENT_STATUS.GET_A_JOB
          })) as data FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          ${
            foundUser.role_id == ROLE.HRO
              ? `AND candidate_information.created_by = ${foundUser.id}`
              : ''
          }
          AND candidate_recruitment.status = ${
            CANDIDATE_RECRUITMENT_STATUS.GET_A_JOB
          }
         )`,
            ),
            'candidate_get_job',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${
            CANDIDATE_RECRUITMENT_STATUS.DO_NOT_GET_A_JOB
          })) as data FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          ${
            foundUser.role_id == ROLE.HRO
              ? `AND candidate_information.created_by = ${foundUser.id}`
              : ''
          }
          AND candidate_recruitment.status = ${
            CANDIDATE_RECRUITMENT_STATUS.DO_NOT_GET_A_JOB
          }
         )`,
            ),
            'candidate_do_not_get_job',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${
            CANDIDATE_RECRUITMENT_STATUS.OFFER_LATER
          })) as data FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          ${
            foundUser.role_id == ROLE.HRO
              ? `AND candidate_information.created_by = ${foundUser.id}`
              : ''
          }
          AND candidate_recruitment.status = ${
            CANDIDATE_RECRUITMENT_STATUS.OFFER_LATER
          }
         )`,
            ),
            'candidate_offer_latter',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${
            CANDIDATE_RECRUITMENT_STATUS.APPROVE_OFFER_LATER
          })) as data FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          ${
            foundUser.role_id == ROLE.HRO
              ? `AND candidate_information.created_by = ${foundUser.id}`
              : ''
          }
          AND candidate_recruitment.status = ${
            CANDIDATE_RECRUITMENT_STATUS.APPROVE_OFFER_LATER
          }
         )`,
            ),
            'candidate_approve_later',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${
            CANDIDATE_RECRUITMENT_STATUS.REJECT_OFFER_LATER
          })) as data FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          ${
            foundUser.role_id == ROLE.HRO
              ? `AND candidate_information.created_by = ${foundUser.id}`
              : ''
          }
          AND candidate_recruitment.status = ${
            CANDIDATE_RECRUITMENT_STATUS.REJECT_OFFER_LATER
          }
         )`,
            ),
            'candidate_reject_later',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${
            CANDIDATE_RECRUITMENT_STATUS.HRO_ADD_CV
          })) as data FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          ${
            foundUser.role_id == ROLE.HRO
              ? `AND candidate_information.created_by = ${foundUser.id}`
              : ''
          }
          AND candidate_recruitment.status = ${
            CANDIDATE_RECRUITMENT_STATUS.HRO_ADD_CV
          }
         )`,
            ),
            'candidate_hro_add',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${
            CANDIDATE_RECRUITMENT_STATUS.ON_BOARD
          })) as data FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          ${
            foundUser.role_id == ROLE.HRO
              ? `AND candidate_information.created_by = ${foundUser.id}`
              : ''
          }
          AND candidate_recruitment.status = ${
            CANDIDATE_RECRUITMENT_STATUS.ON_BOARD
          }
         )`,
            ),
            'candidate_on_board',
          ],
          [
            this.sequelize.literal(
              `(
          SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_recruitment.status,${
            CANDIDATE_RECRUITMENT_STATUS.WARRANTY_EXPIRED
          })) as data FROM candidate_recruitment
          JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
          JOIN user ON user.id = candidate_information.user_id
          WHERE recruitment_requirement_id = RecruitmentRequirement.id
          AND candidate_recruitment.deleted_at IS NULL
          AND user.deleted_at IS NULL
          ${
            foundUser.role_id == ROLE.HRO
              ? `AND candidate_information.created_by = ${foundUser.id}`
              : ''
          }
          AND candidate_recruitment.status = ${
            CANDIDATE_RECRUITMENT_STATUS.WARRANTY_EXPIRED
          }
         )`,
            ),
            'candidate_warranty_expired',
          ],
        ],
      },
      include: [
        {
          model: Enterprise,
          attributes: {
            include: [
              [
                this.sequelize.literal(
                  `(
              SELECT full_name FROM user
              WHERE id = enterprise.responsible_sale_id
              LIMIT 1
                  )`,
                ),
                'responsible_sale',
              ],
            ],
          },
          include: {
            model: User,
            as: 'user',
          },
        },
        {
          model: ProfessionalField,
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
        {
          model: RecruitmentRequirementProvince,
          as: 'recruitment_requirement_province',
          include: {
            model: DFProvince,
            attributes: ['id', 'name'],
          },
        },
      ],
      order: ['status', ['updated_at', 'DESC']],
    };
    const countOptions = {
      where: whereCondition,
      include: [
        {
          model: Enterprise,
          include: [
            {
              model: User,
              as: 'user',
            },
          ],
        },
      ],
    };
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
    countOptions.include.push(provinceDataInclude);
    options.include.push(provinceDataInclude);
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

  async detail(id: number) {
    let recruitment: any = await this.recruitmentRequirementRepository.findOne({
      where: {
        id,
      },
      include: [
        { model: ProfessionalField },
        { model: RecruitmentRequirementFile },
        { model: Enterprise, include: [{ model: User, as: 'user' }] },
        {
          model: RecruitmentRequirementProvince,
          include: [{ model: DFProvince }],
        },
        { model: SalaryRange },
        { model: YearOfExperience },
        { model: AgeGroup },
        { model: FeeOfRecruitmentRequirement, include: [{ model: FeeType }] },
        // {
        //   model: CandidateRecruitment,
        //   include: [
        //     {
        //       model: CandidateInformation,
        //       as: 'candidate_information',
        //       include: [{ model: User }],
        //     },
        //     {
        //       model: User,
        //       attributes: [
        //         'avatar',
        //         'role_id',
        //         'full_name',
        //         'email',
        //         'phone_number',
        //       ],
        //     },
        //   ],
        // },
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

    const foundCandidateRecruitments = await CandidateRecruitment.findAll({
      where: {
        recruitment_requirement_id: id,
      },
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
    });
    recruitment.dataValues.candidate_recruitment =
      foundCandidateRecruitments.filter(
        (elm) => elm.status !== CANDIDATE_RECRUITMENT_STATUS.PENDING_CV,
      );

    const candidate_recruitments = recruitment.dataValues.candidate_recruitment;

    for (const elm of candidate_recruitments) {
      const foundCandidateApply = await CandidateApply.findOne({
        where: {
          candidate_recruitment_id: elm.id,
        },
        include: [
          {
            model: CandidateApplyFile,
          },
        ],
      });

      elm.dataValues.candidate_apply = foundCandidateApply;

      if (elm.candidate_info_review_id) {
        const foundCandidateInforReview = await CandidateInformation.findOne({
          where: {
            id: elm.candidate_info_review_id,
          },
        });
        elm.dataValues.candidate_info_review = foundCandidateInforReview;
      }
    }

    return sendSuccess({
      data: recruitment,
      blocks: {
        status: RECRUITMENT_STATUS,
      },
    });
  }

  async changeStatus(
    user_id: number,
    dto: AdminUpdateStatusRecruitmentRequirementDto,
  ) {
    for (let i = 0; i < dto.ids.length; i++) {
      try {
        const recruitment = await this.recruitmentRequirementRepository.findOne(
          {
            where: {
              id: dto.ids[i],
            },
          },
        );
        if (!recruitment) {
          throw new HttpException(
            'Yêu cầu tuyển dụng nhân sự không tồn tại',
            HttpStatus.NOT_FOUND,
          );
        }
        if (recruitment.status == dto.status) {
          throw new HttpException(
            'Trạng thái thay đổi phải khác với trạng thái hiện tại của yêu cầu tuyển dụng',
            HttpStatus.AMBIGUOUS,
          );
        }
        //Check chặn thay đổi trạng thái của yêu cầu tuyển dụng khi đang ở trạng thái đang tuyển dụng đối sang chờ tiếp nhận và đã tiếp nhận
        const statusPrevent = [
          RECRUITMENT_STATUS.PENDING,
          RECRUITMENT_STATUS.IN_PROGRESS,
        ];
        if (
          recruitment.status === RECRUITMENT_STATUS.PROCESSED &&
          statusPrevent.includes(dto.status)
        ) {
          throw new HttpException(
            'Trạng thái đang tuyển dụng không thể chuyển trạng thái chờ tiếp nhận hoặc đã tiếp nhận',
            HttpStatus.AMBIGUOUS,
          );
        }

        const enterprise = await this.enterpriseRepository.findOne({
          where: { id: recruitment.enterprise_id },
        });
        if (!enterprise) {
          throw new HttpException(
            'Doanh nghiệp không tồn tại trong hệ thống',
            HttpStatus.NOT_FOUND,
          );
        }
        await this.sequelize.transaction(async (transaction: Transaction) => {
          try {
            await recruitment.update(
              {
                status: dto.status,
                modify_date_processed:
                  dto.status === RECRUITMENT_STATUS.PROCESSED
                    ? new Date()
                    : null,
              },
              { transaction },
            );
            await this.recruitmentRequirementHistoryRepository.create(
              {
                recruitment_requirement_id: recruitment.id,
                status: dto.status,
                created_by: user_id,
              },
              { transaction },
            );

            //Trừ điểm các HR đã tạo những job này
            const foundCreatedUser = await this.userRepository.findOne({
              where: {
                id: recruitment.created_by,
              },
            });
            const foundUserPoint: any = await this.userPointRepository.findOne({
              where: { user_id: recruitment.created_by },
            });
            const foundConfigPoint: any =
              await this.configPointHroRepository.findAll();
            if (foundCreatedUser?.role_id === ROLE.HRO) {
              const finalPoint =
                Number(foundUserPoint.point) -
                Number(foundConfigPoint[0].point);

              await this.userPointRepository.update(
                {
                  point: finalPoint > 0 ? finalPoint : 0,
                },
                {
                  where: { user_id: recruitment.created_by },
                  transaction,
                },
              );

              await this.userPointHistoryRepository.create(
                {
                  user_point_id: foundUserPoint.id,
                  type: POINT_TYPE.SUB,
                  value: foundConfigPoint[0].point,
                  current_point:
                    Number(foundUserPoint.point) +
                    Number(foundConfigPoint[0].point),
                  mutable_type: POINT_MUTABLE_TYPE.REMOVE_CV,
                  created_by: user_id,
                  // note: dto.note || null,
                },
                { transaction },
              );
            }
          } catch (error) {
            throw new HttpException(
              'Có lỗi xảy ra không thể cập nhật trạng thái yêu cầu tuyển dụng vào lúc này',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        });

        let title = '';
        let content = '';
        if (dto.status == RECRUITMENT_STATUS.IN_PROGRESS) {
          title = 'Admin xác nhận Đang xử lý yêu cầu tuyển dụng ';
          content = `Yêu cầu tuyển dụng ${recruitment.code} Đang được xử lý`;
        } else if (dto.status == RECRUITMENT_STATUS.PROCESSED) {
          title = 'Admin xác nhận Đã xử lý yêu cầu tuyển dụng ';
          content = `Yêu cầu tuyển dụng ${recruitment.code} Đã được xử lý`;
        } else if (dto.status == RECRUITMENT_STATUS.REJECTED) {
          title = 'Admin xác nhận Từ chối yêu cầu tuyển dụng ';
          content = `Yêu cầu tuyển dụng ${recruitment.code} Đã từ chối yêu cầu tuyển dụng`;
        }
        const notificationPayload: NotificationPayload = {
          title,
          content,
          type: NOTIFICATION_TYPE.RECRUITMENT,
          data: { recruitment_id: recruitment.id },
        };
        this.notificationService.createAndSendNotificationForUsers(
          notificationPayload,
          {
            include_user_ids: [enterprise.user_id],
          },
        );
        await recruitment.reload();
      } catch (error) {
        console.log(error);
      }
    }
    return sendSuccess({ msg: 'Thay đổi trạng thái thành công' });
  }

  async delete(user_id: number, dto: AdminDeleteRecruitmentDto) {
    let SuccessDeleteCount = 0;
    for (let i = 0; i < dto.ids.length; i++) {
      try {
        const recruitmentRequirement =
          await this.recruitmentRequirementRepository.findOne({
            where: { id: dto.ids[i] },
          });
        if (!recruitmentRequirement) {
          throw new HttpException(
            'Yêu cầu tuyển dụng không tồn tại trên hệ thống',
            HttpStatus.NOT_FOUND,
          );
        }
        const candidateRecruitment =
          await this.candidateRecruitmentRepository.findAll({
            where: {
              recruitment_requirement_id: dto.ids[i],
            },
          });
        const candidateInformationIDs: any = candidateRecruitment?.map(
          (e) => e.candidate_information_id,
        );
        await this.sequelize.transaction(async (transaction: Transaction) => {
          await recruitmentRequirement.destroy({ transaction });
          await this.candidateRecruitmentRepository.destroy({
            where: {
              recruitment_requirement_id: dto.ids[i],
            },
            transaction,
          });
          if (candidateInformationIDs && candidateInformationIDs.length > 0) {
            await this.candidateInterviewRepository.destroy({
              where: {
                candidate_information_id: { [Op.in]: candidateInformationIDs },
              },
              transaction,
            });
          }
          //Trừ điểm các HR đã tạo những job này
          const foundCreatedUser = await this.userRepository.findOne({
            where: {
              id: recruitmentRequirement.created_by,
            },
          });
          const foundUserPoint: any = await this.userPointRepository.findOne({
            where: { user_id: recruitmentRequirement.created_by },
          });
          const foundConfigPoint: any =
            await this.configPointHroRepository.findAll();
          if (foundCreatedUser?.role_id === ROLE.HRO) {
            const finalPoint =
              Number(foundUserPoint.point) - Number(foundConfigPoint[0].point);

            await this.userPointRepository.update(
              {
                point: finalPoint > 0 ? finalPoint : 0,
              },
              {
                where: { user_id: recruitmentRequirement.created_by },
                transaction,
              },
            );

            await this.userPointHistoryRepository.create(
              {
                user_point_id: foundUserPoint.id,
                type: POINT_TYPE.SUB,
                value: foundConfigPoint[0].point,
                current_point: finalPoint > 0 ? finalPoint : 0,
                mutable_type: POINT_MUTABLE_TYPE.REMOVE_CV,
                created_by: user_id,
                // note: dto.note || null,
              },
              { transaction },
            );
          }
        });
        SuccessDeleteCount = SuccessDeleteCount + 1;
      } catch (error) {}
    }

    return sendSuccess({
      msg: `Xóa thành công ${SuccessDeleteCount} yêu cầu tuyển dụng`,
    });
  }

  async recruitmentPendingCount() {
    const count = await this.recruitmentRequirementRepository.count({
      where: {
        status: RECRUITMENT_STATUS.PENDING,
      },
    });
    return sendSuccess({ data: count });
  }
}
