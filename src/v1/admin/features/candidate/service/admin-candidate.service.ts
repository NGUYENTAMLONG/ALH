import { InterestListRepository } from '@repositories/interest-list.repository';
//Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
//Other dependencies
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// Local files
import { CandidateFile } from '@models/candidate-file.model';
import { CandidateImage } from '@models/candidate-image.model';
import { CandidateInformationFile } from '@models/candidate-information-file.model';
import { CandidateInterview } from '@models/candidate-interview.model';
import { CandidateJobType } from '@models/candidate-job-type.model';
import { CandidateProvince } from '@models/candidate-province.model';
import { Enterprise } from '@models/enterprise.model';
import { HirePrice } from '@models/hire-price.model';
import { HireRequirementProfessionalField } from '@models/hire-requirement-professional-field.model';
import { HireRequirement } from '@models/hire-requirement.model';
import { InterestListTransaction } from '@models/interest-list-transaction.model';
import { RecruitmentRequirement } from '@models/recruitment-requirement.model';
import { SalaryRange } from '@models/salary-range.model';
import { User } from '@models/user.model';
import { WorkExperience } from '@models/work-experience.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { CandidateFileRepository } from '@repositories/candidate-file.repository';
import { CandidateHireRequirementRepository } from '@repositories/candidate-hire-requirement.repository';
import { CandidateImageRepository } from '@repositories/candidate-image.repository';
import { CandidateInformationFileRepository } from '@repositories/candidate-information-file.repository';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateInterviewRepository } from '@repositories/candidate-interview.repository';
import { CandidateJobTypeRepository } from '@repositories/candidate-job-type.repository';
import { CandidateProvinceRepository } from '@repositories/candidate-province.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { HirePriceRepository } from '@repositories/hire-price.repository';
import { UserRepository } from '@repositories/user.repository';
import { WorkExperienceRepository } from '@repositories/work-experience.repository';
import { configService } from '@services/config.service';
import {
  CANDIDATE_HIRE_REQUIREMENT_STATUS,
  CANDIDATE_RECRUITMENT_STATUS,
  CANDIDATE_STATUS,
  DEFAULT_PASSWORD,
  INTEREST_LIST_STATUS,
  IS_ACTIVE,
  NOTIFICATION_TYPE,
  NotificationPayload,
  ROLE,
  USER_STATUS,
} from '@utils/constants';
import { convertDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { AdminCreateCandidateDto } from '../dto/admin-create-candidate.dto';
import { AdminDeleteCandidateDto } from '../dto/admin-delete-candidate.dto';
import { AdminUpdateStatusCandidateDto } from '../dto/admin-update-status-candidate.dto';
import { FilterAdminCandidate } from '../dto/filter-admin-candidate.dto';
import { AdminUpdateCandidateDto } from './../dto/admin-update-candidate.dto';
import { CandidateInterestRepository } from '@repositories/candidate-interest.repository';
import { CandidateInterestCareerRepository } from '@repositories/candidate-interest-career.repository';
import { CandidateInterest } from '@models/candidate-interest.model';
import { CandidateInterestCareer } from '@models/candidate-interest-career.model';
import { DFCareer } from '@models/df-career.model';
import { Position } from '@models/position.model';
import { DFDegree } from '@models/df-degree.model';
import { Application } from '@models/application.model';
import { FilterApplicationDto } from 'src/v1/mini-app/features/candidate/dto/candidate-recruitment.dto';
import { ApplicationCareer } from '@models/application-career.model';
import { ApplicationProvince } from '@models/application-province.model';
import { DFProvince } from '@models/df-province.model';
import { ApplicationJobType } from '@models/application-job-type.model';
import { JobType } from '@models/job-type.model';
import { JobTypeTime } from '@models/job-type-time.model';
import { JobTypeWorkplace } from '@models/job-type-workplace.model';
import { EducationExperience } from '@models/education-experience.model';
import { SkillExperience } from '@models/skill-experience.model';
import { Referrer } from '@models/referrer.model';
import { ApplicationCV } from '@models/application-cv.model';
import { CVUploaded } from '@models/cv-uploaded.model';
import { NotificationService } from '@services/notification.service';
import { CandidateInformation } from '@models/candidate-information.model';
import { CandidateRecruitment } from '@models/candidate-recruitment.model';

@Injectable()
export class AdminCandidateService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly candidateInformationRepository: CandidateInformationRepository,
    private readonly hirePriceRepository: HirePriceRepository,
    private readonly candidateImageRepository: CandidateImageRepository,
    private readonly candidateFileRepository: CandidateFileRepository,
    private readonly candidateJobTypeRepository: CandidateJobTypeRepository,
    private readonly workExperienceRepository: WorkExperienceRepository,
    private readonly interestListRepository: InterestListRepository,
    private readonly candidateProvinceRepository: CandidateProvinceRepository,
    private readonly candidateRecruitmentRepository: CandidateRecruitmentRepository,
    private readonly candidateInterviewRepository: CandidateInterviewRepository,
    private readonly dfProvinceRepository: DFProvinceRepository,
    private readonly sequelize: Sequelize,
    private readonly candidateInformationFileRepository: CandidateInformationFileRepository,
    private readonly candidateHireRequirementRepository: CandidateHireRequirementRepository,
    private readonly candidateInterestRepository: CandidateInterestRepository,
    private readonly candidateInterestCareerRepository: CandidateInterestCareerRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async create(user_id: number, dto: AdminCreateCandidateDto): Promise<any> {
    //let candidateInformation: CandidateInformation | undefined;
    if (dto.phone_number) {
      const foundPhoneNumber = await this.userRepository.findOne({
        where: {
          phone_number: dto.phone_number,
          status: { [Op.in]: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE] },
          role_id: { [Op.notIn]: [ROLE.CANDIDATE, ROLE.HRO] },
        },
      });

      if (foundPhoneNumber) {
        throw new HttpException(
          'Số điện thoại đã tồn tại trên hệ thống',
          HttpStatus.FOUND,
        );
      }
    }

    if (dto.email) {
      const foundEmail = await this.userRepository.findOne({
        where: {
          email: dto.email,
          status: { [Op.in]: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE] },
          role_id: { [Op.notIn]: [ROLE.CANDIDATE, ROLE.HRO] },
        },
      });

      if (foundEmail) {
        throw new HttpException(
          'Email đã tồn tại trên hệ thống',
          HttpStatus.FOUND,
        );
      }
    }
    if (dto.job_type_ids.length == 0) {
      throw new HttpException(
        'job_type_ids không được để mảng trống',
        HttpStatus.FOUND,
      );
    }
    if (dto.is_all_province == IS_ACTIVE.ACTIVE) {
      if (dto.df_province_ids && dto.df_province_ids.length > 0) {
        throw new HttpException(
          'Vui lòng không chọn khu vực làm việc ',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (dto.df_province_ids && dto.df_province_ids.length == 0) {
      throw new HttpException(
        'df_province_ids không được để mảng trống',
        HttpStatus.FOUND,
      );
    }
    let avatar: string;
    if (dto.image_files && dto.image_files.length > 0) {
      avatar = dto.image_files[0];
    }

    const createdUser = await User.findOne({
      where: {
        id: user_id,
      },
    });

    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        try {
          const user: User | undefined = await this.userRepository.createUser(
            {
              gender_id: dto.gender_id ? dto.gender_id : null,
              role_id: ROLE.CANDIDATE,
              password: DEFAULT_PASSWORD,
              full_name: dto.full_name,
              phone_number: dto.phone_number ? dto.phone_number : null,
              email: dto.email ? dto.email : null,
              date_of_birth: dto.date_of_birth ? dto.date_of_birth : null,
              avatar: avatar,
              created_by: user_id,
              is_real_candidate: 1,
            },
            transaction,
          );
          const candidateInformation =
            await this.candidateInformationRepository.create(
              {
                user_id: user.id,
                professional_field: dto.professional_field,
                note: dto.note ? dto.note : null,
                salary_range_id: dto.salary_range_id,
                years_of_experience_id: dto.years_of_experience_id,
                is_recruitment: dto.is_recruitment,
                is_hire: dto.is_hire,
                skill_input: dto.skill_input || null,
                created_by: user_id,
                is_all_province: dto.is_all_province,
                status:
                  createdUser?.role_id === ROLE.ADMIN
                    ? CANDIDATE_STATUS.OPEN_CV
                    : CANDIDATE_STATUS.PENDING,
                type_on_call: dto.type_on_call || 0,
                type_on_hour: dto.type_on_hour || 0,
                budget_min: dto.budget_min,
                budget_max: dto.budget_max,
                degree_id: dto.degree_id,
              },
              {
                transaction,
              },
            );
          if (dto.df_province_ids && dto.df_province_ids.length > 0) {
            const candidateProvinceCreated = dto.df_province_ids.map((e) => ({
              candidate_information_id: candidateInformation?.id,
              df_province_id: e,
            }));
            await this.candidateProvinceRepository.bulkCreate(
              candidateProvinceCreated,
              { transaction },
            );
          }

          const candidateJobTypeCreated = dto.job_type_ids.map((e) => ({
            candidate_information_id: candidateInformation?.id,
            job_type_id: e,
          }));
          await this.candidateJobTypeRepository.bulkCreate(
            candidateJobTypeCreated,
            { transaction },
          );
          if (dto.salary) {
            const hirePrices = dto.salary.map((e) => ({
              candidate_information_id: candidateInformation?.id,
              salary: e,
            }));
            await this.hirePriceRepository.bulkCreate(hirePrices, {
              transaction,
            });
          }

          if (dto.image_files && dto.image_files.length > 0) {
            const images = dto.image_files.map((e) => ({
              candidate_information_id: candidateInformation?.id,
              image_file: e,
            }));

            await this.candidateImageRepository.bulkCreate(images, {
              transaction,
            });
          }

          await this.candidateFileRepository.create(
            {
              candidate_information_id: candidateInformation?.id,
              voice_recording: dto.voice_recording ? dto.voice_recording : null,
              video_file: dto.video_file ? dto.video_file : null,
            },
            { transaction },
          );
          if (dto.files) {
            const dataCreated = dto.files.map((e) => ({
              candidate_information_id: candidateInformation?.id,
              file: e.file,
              file_name: e.file_name,
            }));
            await this.candidateInformationFileRepository.bulkCreate(
              dataCreated,
              { transaction },
            );
          }
          if (dto.work_experiences && dto.work_experiences.length > 0) {
            const workExperience = dto.work_experiences.map((e) => ({
              candidate_information_id: candidateInformation?.id,
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

          //Tạo bằng cấp cao nhất, số năm kinh nghiệm , vị trí chức vụ mong muốn, mức lương mong muốn của ứng viên
          const payloadCreate = {
            candidate_information_id: candidateInformation?.id,
            df_degree_id: dto.degree_id,
            year_of_experience_id: dto.years_of_experience_id,
            position_id: dto.position_id,
            salary_range_id: dto.salary_range_id,
          };
          const candidateInterest =
            await this.candidateInterestRepository.create(payloadCreate, {
              transaction,
            });
          //Tạo nghề nghiệp quan tâm
          if (dto.career_ids && dto.career_ids.length > 0) {
            const careerListCreated = dto.career_ids.map((e: any) => ({
              candidate_interest_id: candidateInterest?.id,
              df_career_id: e,
            }));
            await this.candidateInterestCareerRepository.bulkCreate(
              careerListCreated,
              { transaction },
            );
          }

          //Gửi thông báo tới Admin
          const foundCreatedUser = await User.findOne({
            where: {
              id: user_id,
            },
          });
          if (foundCreatedUser && foundCreatedUser.role_id === ROLE.HRO) {
            const notificationPayload: NotificationPayload = {
              title: `Ứng viên ${user.full_name} vừa được thêm mới và đang Chờ duyệt`,
              content: `Ứng viên ${user.full_name} vừa được thêm mới và đang Chờ duyệt`,
              type: NOTIFICATION_TYPE.NEW_CANDIDATE_TO_APPROVE,
              data: {
                user_id: user?.id,
                candidate_information_id: candidateInformation?.id,
                notification_type: NOTIFICATION_TYPE.NEW_CANDIDATE_TO_APPROVE,
              },
            };
            this.notificationService.createAndSendNotificationForUsers(
              notificationPayload,
              {
                role_id: [ROLE.ADMIN],
              },
            );
          }

          return candidateInformation;
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể tạo hồ sơ ứng viên vào lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );

    return sendSuccess({
      data: result,
      msg: 'Thêm mới hồ sơ ứng viên thành công',
    });
  }

  async listCandidate(
    user_id: number,
    dto: FilterAdminCandidate,
  ): Promise<any> {
    const foundUser = await this.userRepository.findByPk(user_id);
    if (!foundUser) {
      throw new HttpException(
        'Người dùng không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    let whereCondition: any = {
      [Op.and]: [],
    };
    if (dto.is_hire) {
      whereCondition = {
        ...whereCondition,
        is_hire: dto.is_hire,
      };
    }
    if (dto.is_recruitment) {
      whereCondition.is_recruitment = dto.is_recruitment;
    }

    if (foundUser.role_id == ROLE.HRO) {
      whereCondition.created_by = user_id;
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
    if (
      dto.df_province_ids &&
      dto.df_province_ids.length > 0 &&
      dto.is_all_province == IS_ACTIVE.ACTIVE
    ) {
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            id: {
              [Op.in]: [
                Sequelize.literal(
                  `SELECT candidate_information_id FROM candidate_province where df_province_id in (${dto.df_province_ids}) AND candidate_information_id = CandidateInformation.id`,
                ),
              ],
            },
          },
          {
            is_all_province: IS_ACTIVE.ACTIVE,
          },
        ],
      });
    } else if (dto.df_province_ids && dto.df_province_ids.length > 0) {
      whereCondition[Op.and].push({
        id: {
          [Op.in]: [
            Sequelize.literal(
              `SELECT candidate_information_id FROM candidate_province where df_province_id in (${dto.df_province_ids}) AND candidate_information_id = CandidateInformation.id`,
            ),
          ],
        },
      });
    } else if (dto.is_all_province == IS_ACTIVE.ACTIVE) {
      whereCondition.is_all_province = IS_ACTIVE.ACTIVE;
    }
    if (dto.professional_field_ids) {
      whereCondition.professional_field_id = {
        [Op.in]: dto.professional_field_ids.split(','),
      };
    }
    if (dto.status) {
      whereCondition.status = {
        [Op.in]: dto.status.split(','),
      };
    }
    if (dto.interest_from_date || dto.interest_to_date) {
      const { fromDate, toDate } = convertDateTime(
        dto.interest_from_date,
        dto.interest_to_date,
      );
      let candidateIDs: number[] = [];
      const interestList = await this.interestListRepository.findAll({
        where: {
          created_at: { [Op.between]: [fromDate, toDate] },
          status: INTEREST_LIST_STATUS.WAITING_APPROVE,
        },
      });
      if (interestList && interestList.length > 0) {
        candidateIDs = interestList.map((e) => e.candidate_information_id);
      }
      whereCondition[Op.and].push({
        id: {
          [Op.in]: candidateIDs,
        },
      });
    }
    if (dto.approve_from_date || dto.approve_to_date) {
      const { fromDate, toDate } = convertDateTime(
        dto.approve_from_date,
        dto.approve_to_date,
      );
      let candidateIDs: number[] = [];
      const interestList = await this.interestListRepository.findAll({
        where: {
          created_at: { [Op.between]: [fromDate, toDate] },
          status: INTEREST_LIST_STATUS.APPROVE,
        },
      });
      if (interestList && interestList.length > 0) {
        candidateIDs = interestList.map((e) => e.candidate_information_id);
      }
      whereCondition[Op.and].push({
        id: {
          [Op.in]: candidateIDs,
        },
      });
    }

    const options: any = {
      attributes: {
        include: [
          [
            this.sequelize.literal(
              `(
              SELECT COUNT( candidate_hire_requirement.id) FROM candidate_hire_requirement
              WHERE candidate_information_id = CandidateInformation.id
              AND status = ${CANDIDATE_HIRE_REQUIREMENT_STATUS.PENDING}
              AND deleted_at IS NULL
              LIMIT 1
             )`,
            ),
            'choose_count',
          ],
          [
            this.sequelize.literal(
              `(
                SELECT COUNT( candidate_hire_requirement.id) FROM candidate_hire_requirement
                WHERE candidate_information_id = CandidateInformation.id
                AND status = ${CANDIDATE_HIRE_REQUIREMENT_STATUS.COMPLETED}
                AND deleted_at IS NULL
                LIMIT 1
             )`,
            ),
            'approve_count',
          ],
          [
            this.sequelize.literal(
              `(
              SELECT JSON_OBJECT('full_name',full_name,'role',CASE
              WHEN role_id = 1 THEN "Admin"
              WHEN role_id = 2 THEN "Enterprise"
              WHEN role_id = 3 THEN "Ứng viên"
              WHEN role_id = 4 THEN "Sale triển khai"
              WHEN role_id = 5 THEN "Sale phụ trách"
              WHEN role_id = 7 THEN "Cộng tác viên"
              ELSE "HRO"
              END) FROM user
              WHERE id = CandidateInformation.created_by
              LIMIT 1
             )`,
            ),
            'created_by_info',
          ],
        ],
        exclude: [],
      },
      where: whereCondition,
      include: [
        {
          model: User,
          where: {
            ...(dto.role_tab
              ? dto.role_tab === ROLE.CANDIDATE.toString()
                ? {
                    role_id: ROLE.CANDIDATE,
                  }
                : { role_id: ROLE.COLLABORATOR }
              : ''),
            ...(dto.search
              ? {
                  [Op.or]: [
                    { full_name: { [Op.like]: `%${dto.search}%` } },
                    {
                      phone_number: { [Op.like]: `%${dto.search}%` },
                    },
                  ],
                }
              : {}),
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
      ],
      order: [['id', 'DESC']],
    };
    const countOptions = {
      where: whereCondition,
      include: [
        {
          model: User,
          where: {
            ...(dto.role_tab
              ? dto.role_tab === ROLE.CANDIDATE.toString()
                ? {
                    role_id: ROLE.CANDIDATE,
                  }
                : { role_id: ROLE.COLLABORATOR }
              : ''),
            ...(dto.search
              ? {
                  [Op.or]: [
                    { full_name: { [Op.like]: `%${dto.search}%` } },
                    {
                      phone_number: { [Op.like]: `%${dto.search}%` },
                    },
                  ],
                }
              : {}),
          },
        },
      ],
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

    const blocks = {
      status: [
        { id: 1, name: 'Đã full' },
        { id: 2, name: 'Nhận thêm công việc' },
        { id: 3, name: 'Chưa có công việc' },
        { id: 4, name: 'Ngừng hoạt động' },
      ],
    };

    return sendSuccess({ data: candidates, paging, blocks });
  }

  async detailCandidate(id: number) {
    const candidate = await this.candidateInformationRepository.findOne({
      where: { id },
      attributes: {
        include: [
          [
            this.sequelize.literal(
              `(
            SELECT COUNT(id) FROM interest_list_transaction
            WHERE candidate_information_id = ${id}
            AND status = ${INTEREST_LIST_STATUS.WAITING_APPROVE}
            LIMIT 1
           )`,
            ),
            'choose_count',
          ],
        ],
      },
      include: [
        { model: User },
        {
          model: CandidateJobType,
          attributes: {
            include: [
              [
                Sequelize.literal(
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
        { model: YearOfExperience },
        { model: SalaryRange },
        { model: HirePrice },
        { model: CandidateFile },
        { model: CandidateImage },
        { model: WorkExperience },
        {
          model: InterestListTransaction,
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
        },
        {
          model: CandidateInterview,
        },
        { model: CandidateInformationFile },
        {
          model: CandidateInterest,
          include: [
            {
              model: CandidateInterestCareer,
              attributes: ['id', 'candidate_interest_id', 'df_career_id'],
              include: [
                {
                  model: DFCareer,
                  attributes: ['id', 'name'],
                },
              ],
            },
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
              model: CandidateInterestCareer,
            },
          ],
        },
        {
          model: CVUploaded,
        },
      ],
    });
    const recruitment = await this.candidateRecruitmentRepository.findAll({
      where: { candidate_information_id: id },
      include: {
        model: RecruitmentRequirement,
      },
    });
    const hireRequirement =
      await this.candidateHireRequirementRepository.findAll({
        where: { candidate_information_id: id },
        include: {
          model: HireRequirement,
          include: [
            {
              model: HireRequirementProfessionalField,
              attributes: {
                include: [
                  [
                    this.sequelize.literal(
                      `(
                    SELECT name FROM professional_field
                    WHERE id = \`hire_requirement->hire_requirement_professional_field\`.\`professional_field_id\`
                    LIMIT 1
                   )`,
                    ),
                    'professional_field_name',
                  ],
                ],
              },
            },
          ],
        },
      });
    return sendSuccess({
      data: {
        candidate,
        recruitment: recruitment,
        hire_recruitment: hireRequirement,
      },
    });
  }

  async updateCandidateStatus(id: number, dto: AdminUpdateStatusCandidateDto) {
    const candidate = await this.candidateInformationRepository.findOne({
      where: {
        id,
      },
    });
    if (!candidate) {
      throw new HttpException('Không tìm thấy ứng viên', HttpStatus.NOT_FOUND);
    }
    await candidate.update({ status: dto.status });
    await CVUploaded.update(
      { status: dto.status },
      {
        where: {
          candidate_info_review_id: candidate.id,
        },
      },
    );

    //Cập nhật CandidateRecruitment đã ứng tuyển lên trạng thái pending
    let candidate_recruitment_status =
      dto.status === CANDIDATE_STATUS.OPEN_CV
        ? CANDIDATE_RECRUITMENT_STATUS.PENDING
        : CANDIDATE_RECRUITMENT_STATUS.PENDING_CV;
    await CandidateRecruitment.update(
      {
        status: candidate_recruitment_status,
      },
      {
        where: {
          candidate_info_review_id: candidate.id,
        },
      },
    );

    await candidate.reload();
    return sendSuccess({
      data: candidate,
      msg: 'Thay đổi trạng thái ứng viên thành công',
    });
  }

  async resetPassword(id: number) {
    const candidate = await this.candidateInformationRepository.findOne({
      where: {
        id,
      },
    });
    if (!candidate) {
      throw new HttpException('Không tìm thấy ứng viên', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({
      where: {
        id: candidate.user_id,
      },
    });
    if (!user) {
      throw new HttpException(
        'User không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await user.update(
          {
            password: configService.getEnv('CODE_FORGOT_PASSWORD'),
          },
          { transaction },
        );
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể tạo hồ sơ ứng viên vào lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    await user.reload();
    return sendSuccess({
      data: user,
      msg: 'Reset mật khẩu ứng viên thành công',
    });
  }

  async updateCandidate(id: number, dto: AdminUpdateCandidateDto) {
    const candidate = await this.candidateInformationRepository.findOne({
      where: {
        id,
      },
    });
    if (!candidate) {
      throw new HttpException('Không tìm thấy ứng viên', HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findByPk(candidate.user_id);
    if (!user) {
      throw new HttpException('Không tìm thấy ứng viên', HttpStatus.NOT_FOUND);
    }
    if (dto.phone_number) {
      const foundPhoneNumber = await this.userRepository.findOne({
        where: {
          phone_number: dto.phone_number,
          status: { [Op.in]: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE] },
          role_id: { [Op.notIn]: [ROLE.CANDIDATE, ROLE.HRO] },
          id: { [Op.ne]: user.id },
        },
      });

      if (foundPhoneNumber) {
        throw new HttpException(
          'Số điện thoại đã tồn tại trên hệ thống',
          HttpStatus.FOUND,
        );
      }
    }

    if (dto.email) {
      const foundEmail = await this.userRepository.findOne({
        where: {
          email: dto.email,
          status: { [Op.in]: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE] },
          role_id: { [Op.notIn]: [ROLE.CANDIDATE, ROLE.HRO] },
          id: { [Op.ne]: user.id },
        },
      });

      if (foundEmail) {
        throw new HttpException(
          'Email đã tồn tại trên hệ thống',
          HttpStatus.FOUND,
        );
      }
    }
    if (dto.is_all_province == IS_ACTIVE.ACTIVE) {
      if (dto.df_province_ids && dto.df_province_ids.length > 0) {
        throw new HttpException(
          'Vui lòng không chọn khu vực làm việc ',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (dto.df_province_ids && dto.df_province_ids.length > 0) {
      const province = await this.dfProvinceRepository.findAll({
        where: {
          id: { [Op.in]: dto.df_province_ids },
        },
      });

      if (province?.length != dto.df_province_ids.length) {
        throw new HttpException(
          'Khu vực làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    let avatar: string;
    if (dto.image_files && dto.image_files.length > 0) {
      avatar = dto.image_files[0];
    }
    if (dto.is_hire == IS_ACTIVE.ACTIVE && dto.is_hire != candidate.is_hire) {
      const foundCandidateRecruitment =
        await this.candidateRecruitmentRepository.findOne({
          where: {
            candidate_information_id: id,
            status: {
              [Op.notIn]: [
                CANDIDATE_RECRUITMENT_STATUS.REJECT_CV,
                CANDIDATE_RECRUITMENT_STATUS.DO_NOT_GET_A_JOB,
                CANDIDATE_RECRUITMENT_STATUS.REJECT_OFFER_LATER,
              ],
            },
          },
        });
      if (foundCandidateRecruitment) {
        throw new HttpException(
          'Ứng viên đang có trong yêu cầu tuyển dụng không chuyển được loại ứng viên',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await user.update(
          {
            avatar: avatar,
            gender_id: dto.gender_id ? dto.gender_id : null,
            role_id: ROLE.CANDIDATE,
            password: dto.password,
            full_name: dto.full_name,
            phone_number: dto.phone_number || null,
            email: dto.email || null,
            date_of_birth: dto.date_of_birth ? dto.date_of_birth : null,
          },
          { transaction },
        );
        await candidate.update(
          {
            professional_field: dto.professional_field,
            note: dto.note ? dto.note : null,
            salary_range_id:
              dto.is_recruitment == IS_ACTIVE.ACTIVE &&
              dto.is_hire != IS_ACTIVE.ACTIVE
                ? null
                : dto.salary_range_id,
            years_of_experience_id: dto.years_of_experience_id,
            is_recruitment: dto.is_recruitment,
            is_hire: dto.is_hire,
            skill_input: dto.skill_input || null,
            is_all_province: dto.is_all_province || 0,
            type_on_call: dto.type_on_call || 0,
            type_on_hour: dto.type_on_hour || 0,
            budget_min: dto.budget_min,
            budget_max: dto.budget_max,
            degree_id: dto.degree_id,
          },
          {
            transaction,
          },
        );
        if (dto.is_all_province == IS_ACTIVE.ACTIVE) {
          await this.candidateProvinceRepository.destroy({
            where: {
              candidate_information_id: candidate.id,
            },
            transaction,
          });
        } else if (dto.df_province_ids) {
          const listIdsCreate =
            await this.candidateProvinceRepository.bulkDeleteProvince(
              id,
              dto.df_province_ids,
              transaction,
            );
          await this.candidateProvinceRepository.bulkCreateProvince(
            id,
            listIdsCreate || [],
            transaction,
          );
        }

        if (dto.job_type_ids && dto.job_type_ids.length > 0) {
          const listIdsCreate =
            await this.candidateJobTypeRepository.bulkDeleteJobType(
              id,
              dto.job_type_ids,
              transaction,
            );
          await this.candidateJobTypeRepository.bulkCreateJobType(
            id,
            listIdsCreate || [],
            transaction,
          );
        }
        if (dto.salary) {
          await this.hirePriceRepository.destroy({
            where: {
              candidate_information_id: id,
            },
            transaction,
          });
          const hirePrices = dto.salary.map((e) => ({
            candidate_information_id: id,
            salary: e,
          }));
          await this.hirePriceRepository.bulkCreate(hirePrices, {
            transaction,
          });
        }

        if (dto.image_files && dto.image_files.length > 0) {
          await this.candidateImageRepository.destroy({
            where: {
              candidate_information_id: id,
            },
            transaction,
          });
          const images = dto.image_files.map((e) => ({
            candidate_information_id: id,
            image_file: e,
          }));

          await this.candidateImageRepository.bulkCreate(images, {
            transaction,
          });
        }

        await this.candidateFileRepository.destroy({
          where: {
            candidate_information_id: id,
          },
          transaction,
        });
        await this.candidateFileRepository.create(
          {
            candidate_information_id: id,
            voice_recording: dto.voice_recording ? dto.voice_recording : null,
            video_file: dto.video_file ? dto.video_file : null,
          },
          { transaction },
        );
        await this.candidateInformationFileRepository.destroy({
          where: {
            candidate_information_id: id,
          },
          transaction,
        });
        if (dto.files && dto.files.length > 0) {
          const dataCreated = dto.files.map((e) => ({
            candidate_information_id: id,
            file: e.file,
            file_name: e.file_name,
          }));
          await this.candidateInformationFileRepository.bulkCreate(
            dataCreated,
            {
              transaction,
            },
          );
        }

        if (dto.work_experiences && dto.work_experiences.length > 0) {
          await this.workExperienceRepository.destroy({
            where: {
              candidate_information_id: id,
            },
            transaction,
          });
          const workExperience = dto.work_experiences.map((e) => ({
            candidate_information_id: id,
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
          dto.is_recruitment == IS_ACTIVE.ACTIVE &&
          dto.is_hire != IS_ACTIVE.ACTIVE
        ) {
          await this.hirePriceRepository.destroy({
            where: {
              candidate_information_id: id,
            },
            transaction,
          });
        }

        //Cập nhật bằng cấp cao nhất, số năm kinh nghiệm , vị trí chức vụ mong muốn, mức lương mong muốn của ứng viên
        const foundCandidateInterest =
          await this.candidateInterestRepository.findOne({
            where: {
              candidate_information_id: candidate?.id,
            },
          });
        if (foundCandidateInterest) {
          //Nếu đã có data quan tâm
          const payloadUpdate = {
            df_degree_id: dto.degree_id,
            year_of_experience_id: dto.years_of_experience_id,
            position_id: dto.position_id,
            salary_range_id: dto.salary_range_id,
          };

          await this.candidateInterestRepository.update(payloadUpdate, {
            where: {
              id: foundCandidateInterest.id,
              candidate_information_id: candidate?.id,
            },
            transaction,
          });
          //Cập nhật nghề nghiệp quan tâm
          if (dto.career_ids && dto.career_ids.length > 0) {
            //Xoá các sự nghiệp quan tâm đã tạo trước đó
            await this.candidateInterestCareerRepository.destroy({
              where: {
                candidate_interest_id: foundCandidateInterest.id,
              },
              transaction,
            });

            const careerListCreated = dto.career_ids.map((e: any) => ({
              candidate_interest_id: foundCandidateInterest?.id,
              df_career_id: e,
            }));
            await this.candidateInterestCareerRepository.bulkCreate(
              careerListCreated,
              { transaction },
            );
          }
        } else {
          //Nếu chưa có data quan tâm
          //Tạo bằng cấp cao nhất, số năm kinh nghiệm , vị trí chức vụ mong muốn, mức lương mong muốn của ứng viên
          const payloadCreate = {
            candidate_information_id: candidate?.id,
            df_degree_id: dto.degree_id,
            year_of_experience_id: dto.years_of_experience_id,
            position_id: dto.position_id,
            salary_range_id: dto.salary_range_id,
          };
          const candidateInterest =
            await this.candidateInterestRepository.create(payloadCreate, {
              transaction,
            });
          //Tạo nghề nghiệp quan tâm
          if (dto.career_ids && dto.career_ids.length > 0) {
            const careerListCreated = dto.career_ids.map((e: any) => ({
              candidate_interest_id: candidateInterest?.id,
              df_career_id: e,
            }));
            await this.candidateInterestCareerRepository.bulkCreate(
              careerListCreated,
              { transaction },
            );
          }
        }

        //Cập nhật trạng thái duyệt cv tải từ máy
        await CVUploaded.update(
          { status: dto.status },
          {
            where: {
              candidate_info_review_id: candidate.id,
            },
            transaction,
          },
        );
        //Cập nhật CandidateRecruitment đã ứng tuyển lên trạng thái pending
        let candidate_recruitment_status =
          dto.status === CANDIDATE_STATUS.OPEN_CV
            ? CANDIDATE_RECRUITMENT_STATUS.PENDING
            : CANDIDATE_RECRUITMENT_STATUS.PENDING_CV;
        await CandidateRecruitment.update(
          {
            status: candidate_recruitment_status,
          },
          {
            where: {
              candidate_info_review_id: candidate.id,
            },
            transaction,
          },
        );
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể cập nhật hồ sơ ứng viên vào lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });

    return sendSuccess({
      data: candidate,
      msg: 'Cập nhật hồ sơ ứng viên thành công',
    });
  }

  async delete(user_id: number, dto: AdminDeleteCandidateDto) {
    let deleteSuccess = '';
    let deleteFalse = '';
    const foundUser = await this.userRepository.findByPk(user_id);
    if (!foundUser) {
      throw new HttpException(
        'Người dùng không tồn tại trong hệ thống.',
        HttpStatus.NOT_FOUND,
      );
    }
    for (let i = 0; i < dto.ids.length; i++) {
      try {
        const candidate = await this.candidateInformationRepository.findOne({
          where: {
            id: dto.ids[i],
          },
          include: {
            model: User,
          },
        });

        if (!candidate) {
          throw new HttpException(
            'Ứng viên không tồn tại trên hệ thống.',
            HttpStatus.NOT_FOUND,
          );
        }

        if (foundUser.role_id == ROLE.HRO) {
          const foundCandidateRecruitment =
            await this.candidateRecruitmentRepository.findOne({
              where: {
                candidate_information_id: dto.ids[i],
              },
            });
          if (foundCandidateRecruitment) {
            throw new HttpException(
              `${candidate.user.full_name}`,
              HttpStatus.BAD_REQUEST,
            );
          }
        }

        await this.sequelize.transaction(async (transaction: Transaction) => {
          try {
            await candidate.destroy({ transaction });
            await this.userRepository.destroy({
              where: { id: candidate.user_id },
              transaction,
            });
            await this.interestListRepository.destroy({
              where: { candidate_information_id: candidate.id },
              transaction,
            });
            await this.candidateRecruitmentRepository.destroy({
              where: { candidate_information_id: candidate.id },
              transaction,
            });
            await this.candidateInterviewRepository.destroy({
              where: { candidate_information_id: candidate.id },
              transaction,
            });
            await this.candidateHireRequirementRepository.destroy({
              where: { candidate_information_id: candidate.id },
              transaction,
            });

            await CandidateInterest.destroy({
              where: { candidate_information_id: candidate.id },
              transaction,
            });

            await Application.destroy({
              where: { candidate_information_id: candidate.id },
              transaction,
            });

            if (i == dto.ids.length - 1) {
              deleteSuccess = deleteSuccess + candidate.user.full_name + '. ';
            } else {
              deleteSuccess = deleteSuccess + candidate.user.full_name + ', ';
            }
          } catch (error) {
            throw new HttpException(
              `Có lỗi xảy ra không thể xoá ứng viên ${candidate.user.full_name} lúc này. `,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        });
      } catch (error) {
        if (i == dto.ids.length - 1) {
          deleteFalse = deleteFalse + error.message + '. ';
        } else {
          deleteFalse = deleteFalse + error.message + ', ';
        }
      }
    }
    const result = `${
      deleteSuccess.length > 0
        ? `Xóa thành công ứng viên: ${deleteSuccess}`
        : ''
    }${
      deleteFalse.length > 0 ? `Không xóa được ứng viên: ${deleteFalse}` : ''
    }`;
    return sendSuccess({ msg: result });
  }

  async applicationListOfCandidate(user_id: number, dto: FilterApplicationDto) {
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
      order: [['updated_at', 'DESC']],
    };
    const countOptions: any = {
      where: whereCondition,
    };

    const count = await Application.count(countOptions);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const applications: any = await Application.findAll(options);

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

  async applicationUploadFromDeviceOfCandidate(
    user_id: number,
    dto: FilterApplicationDto,
  ) {
    const founUser: any = await this.userRepository.findOne({
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

    const whereCondition: any = {
      [Op.and]: [
        founUser?.is_real_candidate
          ? {
              candidate_information_id: founUser.candidate_information.id,
            }
          : {
              candidate_info_review_id: founUser.candidate_information.id,
            },
      ],
    };

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }

    const includeCountOptions: any = [];
    const includeOptions: any = [
      // {
      //   model: DFDegree,
      // },
    ];

    const options: any = {
      where: whereCondition,
      attributes: {
        include: [],
      },
      include: includeOptions,
      order: [['updated_at', 'DESC']],
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

    const applications: any = await CVUploaded.findAll(options);

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
}
