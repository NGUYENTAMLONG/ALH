// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Op, Transaction } from 'sequelize';
// Local files
import { CandidateInformation } from '@models/candidate-information.model';
import { CandidateInterview } from '@models/candidate-interview.model';
import { CandidateJobType } from '@models/candidate-job-type.model';
import { CandidateProvince } from '@models/candidate-province.model';
import { CandidateRecruitment } from '@models/candidate-recruitment.model';
import { DFProvince } from '@models/df-province.model';
import { JobType } from '@models/job-type.model';
import { User } from '@models/user.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { RecruitmentRequirementHistoryRepository } from '@repositories/recruitment-requirement-history.repository';
import { RecruitmentRequirementImplementationRepository } from '@repositories/recruitment-requirement-implementation.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { UserRepository } from '@repositories/user.repository';
import { configService } from '@services/config.service';
import { MailService } from '@services/mail.service';
import { NotificationService } from '@services/notification.service';
import {
  CANDIDATE_RECRUITMENT_STATUS,
  NOTIFICATION_TYPE,
  NotificationPayload,
  RECRUITMENT_STATUS,
  ROLE,
} from '@utils/constants';
import { convertDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { Sequelize } from 'sequelize-typescript';
import { EnterpriseFilterCandidateRecruitmentDto } from '../dto/filter-candidate-recruitment.dto';
import { EnterpriseUpdateCandidateRecruitmentDto } from '../dto/update-candidate-recruitment.dto';
import { CandidateApply } from '@models/candidate-apply.model';
import { CandidateApplyFile } from '@models/candidate-apply-file.model';

@Injectable()
export class EnterpriseCandidateRecruitmentService {
  constructor(
    private readonly candidateRecruitmentRepository: CandidateRecruitmentRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly candidateInformationRepository: CandidateInformationRepository,
    private readonly recruitmentRequirementRepository: RecruitmentRequirementRepository,
    private readonly recruitmentRequirementImplementationRepository: RecruitmentRequirementImplementationRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationService,
    private readonly mailService: MailService,
    private readonly sequelize: Sequelize,
    private readonly recruitmentRequirementHistoryRepository: RecruitmentRequirementHistoryRepository,
  ) {}

  async getListCandidate(
    user_id: number,
    dto: EnterpriseFilterCandidateRecruitmentDto,
  ) {
    const enterprise = await this.enterpriseRepository.findEnterprise(user_id);

    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const whereOption: any = {
      recruitment_requirement_id: dto.recruitment_requirement_id,
      status: {
        [Op.notIn]: [
          CANDIDATE_RECRUITMENT_STATUS.HRO_ADD_CV,
          CANDIDATE_RECRUITMENT_STATUS.PENDING_CV,
        ],
      },
      [Op.and]: [],
    };
    if (dto.search) {
      whereOption[Op.and].push({
        candidate_information_id: {
          [Op.in]: [
            Sequelize.literal(
              `SELECT candidate_information.id FROM candidate_information JOIN user ON user.id = candidate_information.user_id
              WHERE user.full_name LIKE '%${dto.search}%'`,
            ),
          ],
        },
      });
    }
    if (dto.status) {
      whereOption.status = { [Op.in]: dto.status.split(',') };
    }
    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereOption.created_at = { [Op.between]: [fromDate, toDate] };
    }
    const options: any = {
      where: whereOption,
      include: [
        {
          model: CandidateInformation,
          as: 'candidate_information',
          required: true,
          include: [
            {
              model: User,
              required: true,
              attributes: {
                exclude: ['phone_number', 'email', 'alternate_phone'],
              },
            },
            { model: YearOfExperience },
            { model: CandidateJobType, include: { model: JobType } },
            {
              model: CandidateProvince,
              include: { model: DFProvince },
            },
          ],
        },
        { model: CandidateInterview },
      ],
      order: [['id', 'DESC']],
    };
    const count = await this.candidateRecruitmentRepository.count({
      where: whereOption,
      include: [
        {
          model: CandidateInformation,
          as: 'candidate_information',
          required: true,
          include: [
            {
              model: User,
              required: true,
              attributes: {
                exclude: ['phone_number', 'email', 'alternate_phone'],
              },
            },
          ],
        },
      ],
    });
    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );
    options.limit = page_size;
    options.offset = offset;
    const candidateRecruitment: any =
      await this.candidateRecruitmentRepository.findAll(options);
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };

    // Mapping thêm trường vào từng item trong candidateRecruitment
    for (const elm of candidateRecruitment) {
      // Tìm kiếm các CandidateApply liên quan đến từng candidateRecruitment
      const candidateApplied = await CandidateApply.findOne({
        where: {
          candidate_recruitment_id: elm.id,
        },
        include: [
          {
            model: CandidateApplyFile,
          },
        ],
      });

      // Thêm trường NEW_FIELD vào từng item
      elm.dataValues.candidate_applied = candidateApplied;
    }

    return sendSuccess({
      data: candidateRecruitment,
      paging,
      blocks: {
        status: CANDIDATE_RECRUITMENT_STATUS,
      },
    });
  }

  async update(
    id: number,
    dto: EnterpriseUpdateCandidateRecruitmentDto,
    user_id: number,
  ) {
    const foundEnterprise = await this.enterpriseRepository.findOne({
      where: {
        user_id,
      },
    });
    if (!foundEnterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống!',
        HttpStatus.NOT_FOUND,
      );
    }
    const candidateRecruitment: CandidateRecruitment | null =
      await this.candidateRecruitmentRepository.findOne({
        where: {
          id,
        },
      });
    if (!candidateRecruitment) {
      throw new HttpException(
        'Ứng viên trong yêu cầu tuyển dụng không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const recruitmentRequirement =
      await this.recruitmentRequirementRepository.findOne({
        where: {
          id: candidateRecruitment.recruitment_requirement_id,
        },
      });
    if (!recruitmentRequirement) {
      throw new HttpException(
        'Yêu cầu tuyển dụng không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const arrRecruitmentStatus = [
      RECRUITMENT_STATUS.REJECTED,
      RECRUITMENT_STATUS.COMPLETED,
    ];

    const isMatchRecruitmentStatus = arrRecruitmentStatus.find(
      (value) => recruitmentRequirement.status === value,
    );

    if (isMatchRecruitmentStatus) {
      throw new HttpException(
        'Không được phép chỉnh sửa yêu cầu với các trạng thái Hủy và Hoàn thành.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (candidateRecruitment.status == dto.status) {
      throw new HttpException(
        'Trạng thái của ứng viên không thay đổi',
        HttpStatus.BAD_REQUEST,
      );
    }
    const foundCandidate = await this.candidateInformationRepository.findOne({
      where: {
        id: candidateRecruitment.candidate_information_id,
      },
      include: {
        model: User,
      },
    });
    if (!foundCandidate) {
      throw new HttpException(
        'Ứng viên không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    if (
      candidateRecruitment.status != CANDIDATE_RECRUITMENT_STATUS.APPROVE_CV &&
      candidateRecruitment.status != CANDIDATE_RECRUITMENT_STATUS.PENDING &&
      candidateRecruitment.status != CANDIDATE_RECRUITMENT_STATUS.REJECT_CV
    ) {
      throw new HttpException(
        'Không thể thay đổi trạng thái của ứng viên ở trạng thái hiện tại',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await candidateRecruitment.update(
          {
            status: dto.status,
          },
          { transaction },
        );
        await this.recruitmentRequirementHistoryRepository.create(
          {
            recruitment_requirement_id:
              candidateRecruitment.recruitment_requirement_id,
            status: RECRUITMENT_STATUS.UPDATE_CANDIDATE_STATUS,
            created_by: user_id,
            candidate_information_id: foundCandidate.id,
            candidate_recruitment_status: dto.status,
            note: dto.note || null,
          },
          { transaction },
        );
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể cập nhật trạng thái lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    await candidateRecruitment.reload();
    if (dto.status == CANDIDATE_RECRUITMENT_STATUS.APPROVE_CV) {
      const notificationPayload: NotificationPayload = {
        title: `Doanh nghiệp ${foundEnterprise.name} cập nhật trạng thái: Được chọn cho ứng viên ${foundCandidate.user.full_name}`,
        content: `Doanh nghiệp ${foundEnterprise.name} cập nhật trạng thái: Được chọn cho ứng viên ${foundCandidate.user.full_name}`,
        type: NOTIFICATION_TYPE.UPDATE_CANDIDATE_RECRUITMENT_STATUS,
        data: {
          recruitment_id: recruitmentRequirement.id,
          candidate_recruitment_id: candidateRecruitment.id,
        },
      };
      let userIncludes: any[] = [];
      // send email to implement sale
      const foundImplementSale =
        await this.recruitmentRequirementImplementationRepository.findAll({
          where: {
            recruitment_requirement_id: recruitmentRequirement.id,
          },
          include: { model: User },
        });
      if (foundImplementSale && foundImplementSale.length > 0) {
        userIncludes = [
          ...userIncludes,
          ...foundImplementSale.map((e) => e.user_id),
        ];
        for (let i = 0; i < foundImplementSale.length; i++) {
          if (foundImplementSale[i]?.user?.email) {
            this.mailService.enterpriseSendApproveCVtoAdmin({
              receiver_email: foundImplementSale[i].user.email,
              subject: `[Alehub] Cập nhật trạng thái ứng viên trong yêu cầu tuyển dụng`,
              text: {
                logo_url: configService.getEnv('LOGO_URL'),
                recruitment_code: recruitmentRequirement.code,
                recruitment_id: recruitmentRequirement.id,
                candidate_name: foundCandidate.user.full_name,
                enterprise_name: foundEnterprise.name,
                webLoginAdmin: configService.getEnv('WEB_ADMIN'),
              },
            });
          }
        }
      }
      // Send email to Admin
      const foundAdmin = await this.userRepository.findAll({
        where: { role_id: ROLE.ADMIN },
      });
      if (foundAdmin && foundAdmin.length > 0) {
        userIncludes = [...userIncludes, ...foundAdmin.map((e) => e.id)];
        for (let i = 0; i < foundAdmin.length; i++) {
          if (foundAdmin[i]?.email) {
            this.mailService.enterpriseSendApproveCVtoAdmin({
              receiver_email: foundAdmin[i].email,
              subject: `[Alehub] Cập nhật trạng thái ứng viên trong yêu cầu tuyển dụng`,
              text: {
                logo_url: configService.getEnv('LOGO_URL'),
                recruitment_code: recruitmentRequirement.code,
                recruitment_id: recruitmentRequirement.id,
                candidate_name: foundCandidate.user.full_name,
                enterprise_name: foundEnterprise.name,
                webLoginAdmin: configService.getEnv('WEB_ADMIN'),
              },
            });
          }
        }
      }
      this.notificationService.createAndSendNotificationForUsers(
        notificationPayload,
        {
          include_user_ids: userIncludes,
        },
      );
      // Send Email to HRO change status candidate in recruitment
      const candidate = await this.candidateInformationRepository.findOne({
        where: {
          id: candidateRecruitment.candidate_information_id,
        },
        include: {
          model: User,
        },
      });
      if (candidate) {
        const foundUserCreatedCandidate = await this.userRepository.findByPk(
          candidate.created_by,
        );
        if (
          foundUserCreatedCandidate &&
          foundUserCreatedCandidate.role_id == ROLE.HRO
        ) {
          const notificationHROPayload: NotificationPayload = {
            title: `Cập nhật trạng thái: Ứng viên ${candidate.user.full_name} đã được chọn `,
            content: `Cập nhật trạng thái: Ứng viên ${candidate.user.full_name} đã được chọn `,
            type: NOTIFICATION_TYPE.UPDATE_CANDIDATE_RECRUITMENT_STATUS,
            data: {
              recruitment_id: recruitmentRequirement.id,
              candidate_recruitment_id: candidateRecruitment.id,
            },
          };
          this.notificationService.createAndSendNotificationForUsers(
            notificationHROPayload,
            {
              include_user_ids: [foundUserCreatedCandidate.id],
            },
          );
          if (foundUserCreatedCandidate?.email) {
            this.mailService.enterpriseSendApproveCVtoHRO({
              receiver_email: foundUserCreatedCandidate.email,
              subject: `[Alehub] Cập nhật trạng thái ứng viên trong yêu cầu tuyển dụng`,
              text: {
                logo_url: configService.getEnv('LOGO_URL'),
                recruitment_code: recruitmentRequirement.code,
                recruitment_id: recruitmentRequirement.id,
                candidate_name: foundCandidate.user.full_name,
                webLoginAdmin: configService.getEnv('WEB_ADMIN'),
              },
            });
          }
        }
      }
    } else if (dto.status == CANDIDATE_RECRUITMENT_STATUS.REJECT_CV) {
      const notificationPayload: NotificationPayload = {
        title: `Doanh nghiệp ${foundEnterprise.name} cập nhật trạng thái: Từ chối ứng viên ${foundCandidate.user.full_name}`,
        content: `Doanh nghiệp ${foundEnterprise.name} cập nhật trạng thái: Từ chối ứng viên ${foundCandidate.user.full_name}`,
        type: NOTIFICATION_TYPE.UPDATE_CANDIDATE_RECRUITMENT_STATUS,
        data: {
          recruitment_id: recruitmentRequirement.id,
          candidate_recruitment_id: candidateRecruitment.id,
        },
      };
      let userIncludes: any[] = [];
      const foundImplementSale =
        await this.recruitmentRequirementImplementationRepository.findAll({
          where: {
            recruitment_requirement_id: recruitmentRequirement.id,
          },
        });
      if (foundImplementSale && foundImplementSale.length > 0) {
        userIncludes = [
          ...userIncludes,
          ...foundImplementSale.map((e) => e.user_id),
        ];
        for (let i = 0; i < foundImplementSale.length; i++) {
          if (foundImplementSale[i]?.user?.email) {
            this.mailService.enterpriseSendRejectCVtoAdmin({
              receiver_email: foundImplementSale[i].user.email,
              subject: `[Alehub] Cập nhật trạng thái ứng viên trong yêu cầu tuyển dụng`,
              text: {
                logo_url: configService.getEnv('LOGO_URL'),
                recruitment_code: recruitmentRequirement.code,
                recruitment_id: recruitmentRequirement.id,
                candidate_name: foundCandidate.user.full_name,
                enterprise_name: foundEnterprise.name,
                webLoginAdmin: configService.getEnv('WEB_ADMIN'),
              },
            });
          }
        }
      }
      const foundAdmin = await this.userRepository.findAll({
        where: { role_id: ROLE.ADMIN },
      });
      if (foundAdmin && foundAdmin.length > 0) {
        userIncludes = [...userIncludes, ...foundAdmin.map((e) => e.id)];
        if (foundAdmin && foundAdmin.length > 0) {
          userIncludes = [...userIncludes, ...foundAdmin.map((e) => e.id)];
          for (let i = 0; i < foundAdmin.length; i++) {
            if (foundAdmin[i]?.email) {
              this.mailService.enterpriseSendRejectCVtoAdmin({
                receiver_email: foundAdmin[i].email,
                subject: `[Alehub] Cập nhật trạng thái ứng viên trong yêu cầu tuyển dụng`,
                text: {
                  logo_url: configService.getEnv('LOGO_URL'),
                  recruitment_code: recruitmentRequirement.code,
                  recruitment_id: recruitmentRequirement.id,
                  candidate_name: foundCandidate.user.full_name,
                  enterprise_name: foundEnterprise.name,
                  webLoginAdmin: configService.getEnv('WEB_ADMIN'),
                },
              });
            }
          }
        }
      }
      this.notificationService.createAndSendNotificationForUsers(
        notificationPayload,
        {
          include_user_ids: userIncludes,
        },
      );
    }
    return sendSuccess({
      data: candidateRecruitment,
      msg: 'Thay đổi trạng thái thành công',
    });
  }
}
