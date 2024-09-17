// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import * as dayjs from 'dayjs';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// Local files
import { CandidateInformationFile } from '@models/candidate-information-file.model';
import { CandidateInformation } from '@models/candidate-information.model';
import { CandidateInterview } from '@models/candidate-interview.model';
import { CandidateJobType } from '@models/candidate-job-type.model';
import { CandidateProvince } from '@models/candidate-province.model';
import { CandidateRecruitment } from '@models/candidate-recruitment.model';
import { DFProvince } from '@models/df-province.model';
import { Enterprise } from '@models/enterprise.model';
import { JobType } from '@models/job-type.model';
import { ProfessionalField } from '@models/professional-field.model';
import { User } from '@models/user.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateInterviewRepository } from '@repositories/candidate-interview.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { ConfigPointHroRepository } from '@repositories/config-point-hro.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { FeeOfRecruitmentRequirementRepository } from '@repositories/fee-of-recruitment-requirement.repository';
import { RecruitmentRequirementHistoryRepository } from '@repositories/recruitment-requirement-history.repository';
import { RecruitmentRequirementHroRepository } from '@repositories/recruitment-requirement-hro.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { UserPointHistoryRepository } from '@repositories/user-point-history.repository';
import { UserPointRepository } from '@repositories/user-point.repository';
import { UserRepository } from '@repositories/user.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { configService } from '@services/config.service';
import { MailService } from '@services/mail.service';
import { NotificationService } from '@services/notification.service';
import {
  CANDIDATE_RECRUITMENT_STATUS,
  FEE_TYPE,
  IS_ACTIVE,
  NOTIFICATION_TYPE,
  NotificationPayload,
  POINT_MUTABLE_TYPE,
  RECRUITMENT_STATUS,
  ROLE,
  TYPE_OF_FEE,
  USER_STATUS,
  WALLET_MUTABLE_TYPE,
  WALLET_TYPE,
} from '@utils/constants';
import { convertDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { AdminCreateCandidateRecruitmentDto } from '../dto/create-candidate-recruitment.dto';
import { FilterAdminCandidateRecruitment } from '../dto/filter-candidate-recruitment.dto';
import { AdminUpdateCandidateRecruitmentDto } from '../dto/update-candidate-recruitment.dto';
import { sendZaloMessage } from '@utils/send-zalo-message';
import { adminGivesCVTemplate } from 'src/shared/zalo-templates/templates';
import { ConfigPointHro } from '@models/config-point-hro.model';
import { CandidateApply } from '@models/candidate-apply.model';
import { CandidateApplyFile } from '@models/candidate-apply-file.model';
import { TimelineStatus } from '@models/timeline-status.model';

@Injectable()
export class AdminCandidateRecruitmentService {
  constructor(
    private readonly candidateRecruitmentRepository: CandidateRecruitmentRepository,
    private readonly candidateInformationRepository: CandidateInformationRepository,
    private readonly recruitmentRequirementRepository: RecruitmentRequirementRepository,
    private readonly feeOfRecruitmentRequirementRepository: FeeOfRecruitmentRequirementRepository,
    private readonly candidateInterviewRepository: CandidateInterviewRepository,
    private readonly recruitmentRequirementHistoryRepository: RecruitmentRequirementHistoryRepository,
    private readonly walletRepository: WalletRepository,
    private readonly walletHistoryRepository: WalletHistoryRepository,
    private readonly notificationService: NotificationService,
    private readonly mailService: MailService,
    private readonly userRepository: UserRepository,
    private readonly dFProvinceRepository: DFProvinceRepository,
    private readonly sequelize: Sequelize,
    private readonly recruitmentRequirementHroRepository: RecruitmentRequirementHroRepository,
    private readonly configPointHroRepository: ConfigPointHroRepository,
    private readonly userPointRepository: UserPointRepository,
    private readonly userPointHistoryRepository: UserPointHistoryRepository,
  ) {}

  async create(user_id: number, dto: AdminCreateCandidateRecruitmentDto) {
    let bulkCreated: {
      recruitment_requirement_id: number;
      candidate_information_id: number;
      status: number;
      created_by: number;
    }[] = [];
    let status = CANDIDATE_RECRUITMENT_STATUS.PENDING;
    const recruitmentRequirementIDs: number[] = [];
    const userCreated = await this.userRepository.findByPk(user_id);
    if (!userCreated) {
      throw new HttpException(
        'User không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    if (userCreated.role_id == ROLE.HRO) {
      status = CANDIDATE_RECRUITMENT_STATUS.HRO_ADD_CV;
    }
    for (let i = 0; i < dto.recruitment_requirement_ids.length; i++) {
      try {
        const recruitmentRequirement =
          await this.recruitmentRequirementRepository.findOne({
            where: { id: dto.recruitment_requirement_ids[i] },
          });
        if (!recruitmentRequirement) {
          throw new HttpException(
            'Yêu cầu tuyển dụng không tồn tại trên hệ thống. ',
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
            `Không được phép thêm ứng viên vào yêu cầu yêu cầu ${recruitmentRequirement.code} với các trạng thái Từ chối và Hoàn thành. `,
            HttpStatus.BAD_REQUEST,
          );
        }
        for (
          let index = 0;
          index < dto.candidate_information_ids.length;
          index++
        ) {
          const candidate = await this.candidateInformationRepository.findOne({
            where: {
              id: dto.candidate_information_ids[index],
            },
            include: [{ model: User }],
          });
          if (!candidate) {
            throw new HttpException(
              'Ứng viên không tồn tại trên hệ thống. ',
              HttpStatus.NOT_FOUND,
            );
          }
          const foundCandidateRecruitment =
            await this.candidateRecruitmentRepository.findOne({
              where: {
                recruitment_requirement_id: dto.recruitment_requirement_ids[i],
                candidate_information_id: dto.candidate_information_ids[index],
              },
            });
          if (foundCandidateRecruitment) {
            throw new HttpException(
              `Ứng viên ${candidate.user.full_name} đã ở trong yêu cầu tuyển dụng. Không thêm ứng viên vào yêu cầu tuyển dụng được! `,
              HttpStatus.BAD_REQUEST,
            );
          }
          bulkCreated = bulkCreated.concat({
            recruitment_requirement_id: dto.recruitment_requirement_ids[i],
            candidate_information_id: dto.candidate_information_ids[index],
            status,
            created_by: user_id,
          });
          recruitmentRequirementIDs.push(dto.recruitment_requirement_ids[i]);
        }
      } catch (error) {
        console.log(error);
      }
    }

    const bulkCreatedRecruitmentHistoryIDs = [
      ...new Set(recruitmentRequirementIDs),
    ];
    const bulkCreatedRecruitmentHistory = bulkCreatedRecruitmentHistoryIDs.map(
      (e) => ({
        recruitment_requirement_id: e,
        status: RECRUITMENT_STATUS.ADD_CANDIDATE,
        created_by: user_id,
      }),
    );

    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        const createdCandidateRecruitment =
          await this.candidateRecruitmentRepository.bulkCreate(bulkCreated, {
            transaction,
          });
        await this.recruitmentRequirementHistoryRepository.bulkCreate(
          bulkCreatedRecruitmentHistory,
          { transaction },
        );

        // Chuẩn bị dữ liệu để tạo các bản ghi TimelineStatus từ kết quả của createdCandidateRecruitment
        const timelineStatusData = createdCandidateRecruitment.map((elm) => ({
          candidate_recruitment_id: elm.id,
          candidate_information_id: elm.candidate_information_id,
          candidate_info_review_id: null,
          status: CANDIDATE_RECRUITMENT_STATUS.PENDING,
          modify_date: new Date(),
        }));

        // Thực hiện bulkCreate cho TimelineStatus
        await TimelineStatus.bulkCreate(timelineStatusData, { transaction });
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể thêm ứng viên vào yêu cầu tuyển dụng lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });

    const createdByData = [];
    if (userCreated.role_id == ROLE.HRO) {
      for (let index = 0; index < bulkCreated.length; index++) {
        const recruitmentRequirement =
          await this.recruitmentRequirementRepository.findOne({
            where: { id: bulkCreated[index].recruitment_requirement_id },
            include: {
              model: Enterprise,
              include: [{ model: User, as: 'user' }],
            },
          });
        if (!recruitmentRequirement) {
          throw new HttpException(
            'Yêu cầu tuyển dụng không tồn tại trên hệ thống',
            HttpStatus.NOT_FOUND,
          );
        }
        const candidate = await this.candidateInformationRepository.findOne({
          where: {
            id: bulkCreated[index].candidate_information_id,
          },
          include: [{ model: User }],
        });
        if (!candidate) {
          throw new HttpException(
            'Ứng viên không tồn tại trên hệ thống',
            HttpStatus.NOT_FOUND,
          );
        }
        // Push notification to HRO
        const notificationPayload: NotificationPayload = {
          title: 'Bạn đã thêm ứng viên thành công!',
          content: 'Bạn đã thêm ứng viên thành công!',
          type: NOTIFICATION_TYPE.ADD_CANDIDATE,
          data: { recruitment_id: recruitmentRequirement.id },
        };
        this.notificationService.createAndSendNotificationForUsers(
          notificationPayload,
          {
            include_user_ids: [userCreated.id],
          },
        );

        // Push notification Admin
        const adminNotificationPayload: NotificationPayload = {
          title: `Ứng viên ${candidate.user.full_name} vừa được thêm vào yêu cầu tuyển dụng ${recruitmentRequirement.code} của doanh nghiêp ${recruitmentRequirement.enterprise.name}`,
          content: `Ứng viên ${candidate.user.full_name} vừa được thêm vào yêu cầu tuyển dụng ${recruitmentRequirement.code} của doanh nghiêp ${recruitmentRequirement.enterprise.name}`,
          type: NOTIFICATION_TYPE.ADD_CANDIDATE,
          data: { recruitment_id: recruitmentRequirement.id },
        };
        this.notificationService.createAndSendNotificationForUsers(
          adminNotificationPayload,
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
          for (let index = 0; index < admins.length; index++) {
            if (admins[index]?.email) {
              await this.mailService.hroAddCandidateInRecruitmentToAdmin({
                receiver_email: admins[index].email,
                subject: '[Alehub] Thêm ứng viên vào yêu cầu tuyển dụng',
                text: {
                  logo_url: configService.getEnv('LOGO_URL'),
                  enterprise_name: recruitmentRequirement.enterprise.name,
                  position: recruitmentRequirement.professional_field_input,
                  hro_name: userCreated.full_name,
                  webLoginAdmin: configService.getEnv('WEB_ADMIN'),
                  recruitment_id: recruitmentRequirement.id,
                },
              });
            }
          }
        }

        createdByData.push({
          recruitmentRequirement,
          created_by: recruitmentRequirement.created_by,
        });
      }
    } else {
      for (let index = 0; index < bulkCreated.length; index++) {
        const recruitmentRequirement =
          await this.recruitmentRequirementRepository.findOne({
            where: { id: bulkCreated[index].recruitment_requirement_id },
            include: {
              model: Enterprise,
              include: [
                {
                  model: User,
                  as: 'user',
                },
              ],
            },
          });
        if (!recruitmentRequirement) {
          throw new HttpException(
            'Yêu cầu tuyển dụng không tồn tại trên hệ thống',
            HttpStatus.NOT_FOUND,
          );
        }
        const candidate = await this.candidateInformationRepository.findOne({
          where: {
            id: bulkCreated[index].candidate_information_id,
          },
          include: [{ model: User }],
        });
        if (!candidate) {
          throw new HttpException(
            'Ứng viên không tồn tại trên hệ thống',
            HttpStatus.NOT_FOUND,
          );
        }
        // send email to enterprise
        const notificationPayload: NotificationPayload = {
          title: `Ứng viên ${candidate.user.full_name} vừa được thêm vào yêu cầu tuyển dụng ${recruitmentRequirement.code}`,
          content: `Ứng viên ${candidate.user.full_name} vừa được thêm vào yêu cầu tuyển dụng ${recruitmentRequirement.code}`,
          type: NOTIFICATION_TYPE.ADD_CANDIDATE,
          data: { recruitment_id: recruitmentRequirement.id },
        };
        this.notificationService.createAndSendNotificationForUsers(
          notificationPayload,
          {
            include_user_ids: [recruitmentRequirement.enterprise.user.id],
          },
        );
        if (recruitmentRequirement?.enterprise?.user?.email) {
          await this.mailService.sendAddCandidateRecruitmentToEnterprise({
            receiver_email: recruitmentRequirement.enterprise.user.email,
            subject: `[Alehub] Thêm ứng viên cho yêu cầu tuyển dụng`,
            text: {
              logo_url: process.env.LOGO_URL,
              enterprise_name: recruitmentRequirement.enterprise.name,
              recruitment_code: recruitmentRequirement.code,
              recruitment_id: recruitmentRequirement.id,
              candidate_name: candidate.user.full_name,
              professional_field:
                recruitmentRequirement.professional_field_input,
              webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
            },
          });
        }
        // Push notification Admin
        const adminNotificationPayload: NotificationPayload = {
          title: `Ứng viên ${candidate.user.full_name} vừa được thêm vào yêu cầu tuyển dụng ${recruitmentRequirement.code} của doanh nghiêp ${recruitmentRequirement.enterprise.name}`,
          content: `Ứng viên ${candidate.user.full_name} vừa được thêm vào yêu cầu tuyển dụng ${recruitmentRequirement.code} của doanh nghiêp ${recruitmentRequirement.enterprise.name}`,
          type: NOTIFICATION_TYPE.ADD_CANDIDATE,
          data: { recruitment_id: recruitmentRequirement.id },
        };
        // this.notificationService.createAndSendNotificationForUsers(
        //   adminNotificationPayload,
        //   {
        //     role_id: [ROLE.ADMIN],
        //   },
        // );
        // const admins = await this.userRepository.findAll({
        //   where: {
        //     role_id: ROLE.ADMIN,
        //   },
        // });
        // if (admins && admins.length > 0) {
        //   for (let index = 0; index < admins.length; index++) {
        //     this.mailService.sendAddCandidateRecruitmentToAdmin({
        //       receiver_email: admins[index].email,
        //       subject: '[Alehub] Thêm ứng viên vào yêu cầu tuyển dụng',
        //       text: {
        //         logo_url: process.env.LOGO_URL,
        //         candidate_name: candidate.user.full_name,
        //         recruitment_code: recruitmentRequirement.code,
        //         professional_field:
        //           recruitmentRequirement.professional_field_input,
        //         user_name: userCreated.full_name,
        //         enterprise_name: recruitmentRequirement.enterprise.name,
        //         recruitment_id: recruitmentRequirement.id,
        //         webLoginAdmin: configService.getEnv('WEB_ADMIN'),
        //       },
        //     });
        //   }
        // }

        //Push notification to Responsible sale
        if (
          recruitmentRequirement.responsible_sale_id &&
          recruitmentRequirement.responsible_sale_id != userCreated.id
        ) {
          this.notificationService.createAndSendNotificationForUsers(
            adminNotificationPayload,
            {
              include_user_ids: [recruitmentRequirement.responsible_sale_id],
            },
          );
          const responsibleSale = await this.userRepository.findOne({
            where: { id: recruitmentRequirement.responsible_sale_id },
          });
          if (!responsibleSale) {
            throw new HttpException(
              'Sale phụ trách không tồn tại trên hệ thống',
              HttpStatus.NOT_FOUND,
            );
          }

          if (responsibleSale?.email) {
            await this.mailService.sendAddCandidateRecruitmentToResponsibleSale(
              {
                receiver_email: responsibleSale.email,
                subject: '[Alehub] Thêm ứng viên vào yêu cầu tuyển dụng',
                text: {
                  logo_url: process.env.LOGO_URL,
                  candidate_name: candidate.user.full_name,
                  recruitment_code: recruitmentRequirement.code,
                  professional_field:
                    recruitmentRequirement.professional_field_input,
                  enterprise_name: recruitmentRequirement.enterprise.name,
                  recruitment_id: recruitmentRequirement.id,
                  webLoginAdmin: configService.getEnv('WEB_ADMIN'),
                },
              },
            );
          }
        }

        // Cộng điểm cho HRO
        if (candidate.created_by) {
          const foundUserCreatedBy = await this.userRepository.findOne({
            where: {
              id: candidate.created_by,
              role_id: ROLE.HRO,
              status: IS_ACTIVE.ACTIVE,
            },
          });
          if (foundUserCreatedBy && foundUserCreatedBy.role_id == ROLE.HRO) {
            const foundConfigPoint =
              await this.configPointHroRepository.findOne({});
            const userPoint = await this.userPointRepository.findOne({
              where: { user_id: candidate.created_by },
            });
            if (foundConfigPoint && userPoint) {
              const point =
                Number(userPoint.point) + Number(foundConfigPoint.point);
              await userPoint?.update({
                point,
              });
              await this.userPointHistoryRepository.create({
                user_point_id: userPoint?.id,
                type: WALLET_TYPE.ADD,
                mutable_type: POINT_MUTABLE_TYPE.ADD_CV,
                value: foundConfigPoint.point,
                current_point: point,
                created_by: user_id,
                recruitment_requirement_id: recruitmentRequirement.id,
                candidate_information_id: candidate.id,
              });

              // add HRO in recruitment
              const foundHro =
                await this.recruitmentRequirementHroRepository.findOne({
                  where: {
                    recruitment_requirement_id: recruitmentRequirement.id,
                    user_id: candidate.created_by,
                  },
                });
              if (!foundHro) {
                await this.recruitmentRequirementHroRepository.create({
                  recruitment_requirement_id: recruitmentRequirement.id,
                  user_id: candidate.created_by,
                });
              }

              // Push notification add HRO in recruitment
              const notificationAddHROPayload: NotificationPayload = {
                title: `Ứng viên ${candidate.user.full_name} vừa được thêm vào yêu cầu tuyển dụng ${recruitmentRequirement.code}`,
                content: `Ứng viên ${candidate.user.full_name} vừa được thêm vào yêu cầu tuyển dụng ${recruitmentRequirement.code}`,
                type: NOTIFICATION_TYPE.ADD_CANDIDATE,
                data: { recruitment_id: recruitmentRequirement.id },
              };
              this.notificationService.createAndSendNotificationForUsers(
                notificationAddHROPayload,
                {
                  include_user_ids: [candidate.created_by],
                },
              );
              if (foundUserCreatedBy?.email) {
                await this.mailService.sendAddHROCandidateRecruitmentToHRO({
                  receiver_email: foundUserCreatedBy.email,
                  subject: '[Alehub] Thêm ứng viên vào yêu cầu tuyển dụng',
                  text: {
                    logo_url: configService.getEnv('LOGO_URL'),
                    hro_name: foundUserCreatedBy.full_name,
                    enterprise_name: recruitmentRequirement.enterprise.name,
                    recruitment_code: recruitmentRequirement.code,
                    webLoginAdmin: configService.getEnv('WEB_ADMIN'),
                    recruitment_id: recruitmentRequirement.id,
                    candidate_name: candidate.user.full_name,
                  },
                });
              }

              // Push notification HRO
              const notificationHROPayload: NotificationPayload = {
                title: `Cộng ${foundConfigPoint.point} điểm thêm ứng viên ${candidate.user.full_name} vào yêu cầu tuyển dụng ${recruitmentRequirement.code} `,
                content: `Cộng ${foundConfigPoint.point} điểm thêm ứng viên ${candidate.user.full_name} vào yêu cầu tuyển dụng ${recruitmentRequirement.code} `,
                type: NOTIFICATION_TYPE.POINT,
                data: { recruitment_id: recruitmentRequirement.id },
              };
              this.notificationService.createAndSendNotificationForUsers(
                notificationHROPayload,
                {
                  include_user_ids: [candidate.created_by],
                },
              );
              if (foundUserCreatedBy?.email) {
                await this.mailService.sendAddCandidateRecruitmentToHRO({
                  receiver_email: foundUserCreatedBy.email,
                  subject: '[Alehub] Thông báo cộng điểm',
                  text: {
                    logo_url: configService.getEnv('LOGO_URL'),
                    hro_name: foundUserCreatedBy.full_name,
                    candidate_name: candidate.user.full_name,
                    recruitment_code: recruitmentRequirement.code,
                    created_name: userCreated.full_name,
                    point: foundConfigPoint.point,
                    current_point: point,
                    time: dayjs().format('HH:mm:ss DD-MM-YYYY'),
                    note: `Cộng ${foundConfigPoint.point} điểm thêm ứng viên ${candidate.user.full_name} vào yêu cầu tuyển dụng ${recruitmentRequirement.code}`,
                    webLoginAdmin: configService.getEnv('WEB_ADMIN'),
                  },
                });
              }
            }
          }
        }
        createdByData.push({
          recruitmentRequirement,
          created_by: recruitmentRequirement.created_by,
        });
      }
    }

    if (createdByData.length > 0) {
      //Gửi tin nhắn zalo tới HR (người đã tạo tin tuyển dụng)
      const foundHrs: any = await this.userRepository.findAll({
        where: {
          id: {
            [Op.in]: createdByData.map((elm) => elm.created_by),
          },
          role_id: ROLE.HRO,
        },
      });

      const dataToSendMsg: any = [];
      for (const hr of foundHrs) {
        const isMatching = createdByData.find(
          (elm) => elm.created_by === hr?.id,
        );
        if (isMatching) {
          dataToSendMsg.push({
            user: hr,
            recruitment: isMatching.recruitmentRequirement,
          });
        }
      }

      if (dataToSendMsg?.length > 0) {
        for (const elm of dataToSendMsg) {
          if (elm && elm?.user.phone_number) {
            const message = adminGivesCVTemplate(
              elm?.user.full_name,
              elm?.recruitment.position_input,
              'https://zalo.me/s/1312390836269348201/list-candi?env=TESTING&version=32?type=1',
            );
            await sendZaloMessage({
              messages: [
                {
                  phone: elm?.user?.phone_number,
                  name: elm?.user?.full_name,
                  message: message,
                },
              ],
            });
          }
        }
      }
    }

    return sendSuccess({
      msg: 'Thêm mới ứng viên thành công',
    });
  }

  async findAll(
    user_id: number,
    dto: FilterAdminCandidateRecruitment,
  ): Promise<any> {
    const foundUser = await this.userRepository.findByPk(user_id);
    if (!foundUser) {
      throw new HttpException(
        'Người dùng không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const whereOption: any = {
      recruitment_requirement_id: dto.recruitment_requirement_id,
      status: {
        [Op.ne]: CANDIDATE_RECRUITMENT_STATUS.PENDING_CV,
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
    if (dto.schedule_from_date || dto.schedule_to_date) {
      const { fromDate, toDate } = convertDateTime(
        dto.schedule_from_date,
        dto.schedule_to_date,
      );
      whereOption[Op.and].push({
        id: {
          [Op.in]: [
            Sequelize.literal(
              `SELECT candidate_recruitment_id FROM candidate_interview 
              WHERE schedule  BETWEEN "${fromDate}" AND "${toDate}"`,
            ),
          ],
        },
      });
    }

    if (foundUser.role_id == ROLE.HRO) {
      const foundCandidates = await this.candidateInformationRepository.findAll(
        {
          where: {
            created_by: foundUser.id,
          },
        },
      );
      let candidateIDs: number[] = [];
      if (foundCandidates && foundCandidates.length > 0) {
        candidateIDs = foundCandidates.map((e) => e.id);
      }
      whereOption[Op.and].push({
        candidate_information_id: {
          [Op.in]: candidateIDs,
        },
      });
      const foundRecruitmentHro =
        await this.recruitmentRequirementHroRepository.findAll({
          where: {
            recruitment_requirement_id: dto.recruitment_requirement_id,
          },
        });
      let check = false;

      const foundRecruitment =
        await this.recruitmentRequirementRepository.findOne({
          where: {
            id: dto.recruitment_requirement_id,
          },
        });
      if (foundRecruitment && foundRecruitment.is_all_hro) check = true;
      if (foundRecruitmentHro && foundRecruitmentHro.length > 0) {
        const userIDs = foundRecruitmentHro.map((e) => Number(e.user_id));
        if (userIDs.includes(Number(foundUser.id))) check = true;
      }
      if (check != true) {
        throw new HttpException(
          'Bạn không có quyền xem danh sách ứng viên trong yêu cầu tuyển dụng',
          HttpStatus.CONFLICT,
        );
      }
    }

    const options: any = {
      where: whereOption,
      attributes: {
        include: [
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
              WHERE id = CandidateRecruitment.created_by
              LIMIT 1
             )`,
            ),
            'created_by_info',
          ],
        ],
      },
      include: [
        {
          model: CandidateInformation,
          as: 'candidate_information',
          required: true,
          include: [
            {
              model: User,
              required: true,
            },
            { model: YearOfExperience },
            {
              model: CandidateJobType,
              include: { model: JobType },
            },
            {
              model: CandidateProvince,
              include: { model: DFProvince },
            },
            { model: CandidateInformationFile },
          ],
        },
        {
          model: CandidateInformation,
          as: 'candidate_information_review',
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

  async detail(id: number) {
    const candidateRecruitment =
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
    return sendSuccess({ data: candidateRecruitment });
  }

  async update(
    id: number,
    dto: AdminUpdateCandidateRecruitmentDto,
    user_id: number,
  ) {
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
          {
            model: ProfessionalField,
          },
        ],
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
        'Không được phép chỉnh sửa yêu cầu với các trạng thái Từ chối và Hoàn thành.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const candidate = await this.candidateInformationRepository.findOne({
      where: {
        id: candidateRecruitment.candidate_information_id,
      },
      include: {
        model: User,
      },
    });
    if (!candidate) {
      throw new HttpException(
        'Ứng viên không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    if (candidateRecruitment.status == dto.status) {
      throw new HttpException(
        'Trạng thái của ứng viên không thay đổi',
        HttpStatus.BAD_REQUEST,
      );
    }

    const feeOfRecruitmentRequirement =
      await this.feeOfRecruitmentRequirementRepository.findOne({
        where: {
          recruitment_requirement_id:
            candidateRecruitment.recruitment_requirement_id,
          type: TYPE_OF_FEE.ENTERPRISE,
        },
      });
    const wallet = await this.walletRepository.findOne({
      where: {
        user_id: recruitmentRequirement.enterprise.user.id,
      },
    });
    if (!wallet) {
      throw new HttpException(
        'Ví doanh nghiệp không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    let isUpdateWallet = false;
    let mutableType = WALLET_MUTABLE_TYPE.CV;
    if (
      feeOfRecruitmentRequirement &&
      feeOfRecruitmentRequirement.fee_type_id == FEE_TYPE.CV
    ) {
      if (dto.status == CANDIDATE_RECRUITMENT_STATUS.SUCCESSFUL_INTERVIEW) {
        if (
          Number(wallet.balance) < Number(feeOfRecruitmentRequirement.price)
        ) {
          throw new HttpException(
            'Ví doanh nghiệp không đủ tiền để chuyển trạng thái',
            HttpStatus.BAD_REQUEST,
          );
        }
        isUpdateWallet = true;
        mutableType = WALLET_MUTABLE_TYPE.CV;
      }
    } else if (
      feeOfRecruitmentRequirement &&
      feeOfRecruitmentRequirement.fee_type_id == FEE_TYPE.HUNT
    ) {
      if (dto.status == CANDIDATE_RECRUITMENT_STATUS.GET_A_JOB) {
        if (
          Number(wallet.balance) < Number(feeOfRecruitmentRequirement.price)
        ) {
          throw new HttpException(
            'Ví doanh nghiệp không đủ tiền để chuyển trạng thái',
            HttpStatus.BAD_REQUEST,
          );
        }
        isUpdateWallet = true;
        mutableType = WALLET_MUTABLE_TYPE.HUNT;
      }
    }
    // update wallet HRO
    const feeOfRecruitmentRequirementHro =
      await this.feeOfRecruitmentRequirementRepository.findOne({
        where: {
          recruitment_requirement_id:
            candidateRecruitment.recruitment_requirement_id,
          type: TYPE_OF_FEE.HRO,
        },
      });
    let isUpdateHroWallet = false;
    const foundHroWallet = await this.walletRepository.findOne({
      where: {
        user_id: candidate.created_by,
      },
    });
    const foundUserCreated = await this.userRepository.findByPk(
      candidate.created_by,
    );
    if (foundUserCreated?.role_id == ROLE.HRO) {
      if (
        feeOfRecruitmentRequirementHro &&
        feeOfRecruitmentRequirementHro.fee_type_id == FEE_TYPE.CV
      ) {
        if (dto.status == CANDIDATE_RECRUITMENT_STATUS.SUCCESSFUL_INTERVIEW) {
          isUpdateHroWallet = true;
        }
      } else if (
        feeOfRecruitmentRequirementHro &&
        feeOfRecruitmentRequirementHro.fee_type_id == FEE_TYPE.HUNT
      ) {
        if (
          dto.status == CANDIDATE_RECRUITMENT_STATUS.GET_A_JOB ||
          dto.status == CANDIDATE_RECRUITMENT_STATUS.WARRANTY_EXPIRED
        ) {
          isUpdateHroWallet = true;
        }
      }
    }

    // update wallet Candidate (Cập nhật ví hoa hồng của cộng tác viên)
    let isUpdateCandidateWallet = false;

    if (
      dto.status == CANDIDATE_RECRUITMENT_STATUS.SUCCESSFUL_INTERVIEW ||
      dto.status == CANDIDATE_RECRUITMENT_STATUS.WARRANTY_EXPIRED ||
      (candidateRecruitment.status ===
        CANDIDATE_RECRUITMENT_STATUS.WARRANTY_EXPIRED &&
        dto.status !== CANDIDATE_RECRUITMENT_STATUS.WARRANTY_EXPIRED) ||
      (candidateRecruitment.status ===
        CANDIDATE_RECRUITMENT_STATUS.SUCCESSFUL_INTERVIEW &&
        dto.status !== CANDIDATE_RECRUITMENT_STATUS.SUCCESSFUL_INTERVIEW)
    ) {
      isUpdateCandidateWallet = true;
    }

    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await candidateRecruitment.update(
          {
            status: dto.status,
            note: dto.note || null,
          },
          { transaction },
        );
        if (isUpdateWallet) {
          if (
            feeOfRecruitmentRequirement &&
            Number(feeOfRecruitmentRequirement.price) > 0
          ) {
            const balance =
              Number(wallet.balance) -
              Number(feeOfRecruitmentRequirement?.price);
            await wallet.update(
              {
                balance,
              },
              { transaction },
            );
            await this.walletHistoryRepository.create(
              {
                wallet_id: wallet.id,
                type: WALLET_TYPE.SUB,
                value: Number(feeOfRecruitmentRequirement?.price),
                current_balance: balance,
                mutable_type: mutableType,
                created_by: user_id,
                candidate_information_id:
                  candidateRecruitment.candidate_information_id,
                recruitment_requirement_id:
                  candidateRecruitment.recruitment_requirement_id,
              },
              { transaction },
            );
          }
        }
        if (isUpdateHroWallet) {
          if (
            feeOfRecruitmentRequirementHro &&
            Number(feeOfRecruitmentRequirementHro.price) > 0
          ) {
            if (foundHroWallet) {
              const balance =
                Number(foundHroWallet.balance) +
                Number(feeOfRecruitmentRequirementHro.price);

              await foundHroWallet.update(
                {
                  balance,
                },
                { transaction },
              );
              await this.walletHistoryRepository.create(
                {
                  wallet_id: foundHroWallet.id,
                  type: WALLET_TYPE.ADD,
                  value: Number(feeOfRecruitmentRequirementHro.price),
                  current_balance: balance,
                  mutable_type: mutableType,
                  created_by: user_id,
                  candidate_information_id:
                    candidateRecruitment.candidate_information_id,
                  recruitment_requirement_id:
                    candidateRecruitment.recruitment_requirement_id,
                },
                { transaction },
              );
            }
          }
        }

        //Lưu DB cộng tiền hoa hồng CTV
        if (isUpdateCandidateWallet) {
          const foundCandidateWallet = await this.walletRepository.findOne({
            where: {
              user_id: candidate.user_id,
            },
          });
          const feeOfRecruitmentRequirement =
            await this.feeOfRecruitmentRequirementRepository.findOne({
              where: {
                recruitment_requirement_id:
                  candidateRecruitment.recruitment_requirement_id,
                type: TYPE_OF_FEE.ENTERPRISE,
              },
            });

          if (
            feeOfRecruitmentRequirement &&
            Number(feeOfRecruitmentRequirement.price) > 0 &&
            ((feeOfRecruitmentRequirement.fee_type_id === FEE_TYPE.CV &&
              dto.status ===
                CANDIDATE_RECRUITMENT_STATUS.SUCCESSFUL_INTERVIEW) ||
              (feeOfRecruitmentRequirement.fee_type_id === FEE_TYPE.HUNT &&
                dto.status === CANDIDATE_RECRUITMENT_STATUS.WARRANTY_EXPIRED))
          ) {
            //Trường hợp cộng
            if (foundCandidateWallet) {
              const balance =
                Number(foundCandidateWallet.balance) +
                Number(feeOfRecruitmentRequirement.price);

              await foundCandidateWallet.update(
                {
                  balance,
                },
                { transaction },
              );
              await this.walletHistoryRepository.create(
                {
                  wallet_id: foundCandidateWallet.id,
                  type: WALLET_TYPE.ADD,
                  value: Number(feeOfRecruitmentRequirement.price),
                  current_balance: balance,
                  mutable_type:
                    feeOfRecruitmentRequirement.fee_type_id === FEE_TYPE.CV
                      ? WALLET_MUTABLE_TYPE.CV
                      : WALLET_MUTABLE_TYPE.HUNT,
                  created_by: user_id,
                  candidate_information_id:
                    candidateRecruitment.candidate_information_id,
                  recruitment_requirement_id:
                    candidateRecruitment.recruitment_requirement_id,
                },
                { transaction },
              );
            }
          }
          //Trường hợp trừ
          // else if (
          //   (candidateRecruitment.status ===
          //     CANDIDATE_RECRUITMENT_STATUS.WARRANTY_EXPIRED &&
          //     dto.status !== CANDIDATE_RECRUITMENT_STATUS.WARRANTY_EXPIRED) ||
          //   (candidateRecruitment.status ===
          //     CANDIDATE_RECRUITMENT_STATUS.SUCCESSFUL_INTERVIEW &&
          //     dto.status !== CANDIDATE_RECRUITMENT_STATUS.SUCCESSFUL_INTERVIEW)
          // ) {
          //   if (foundCandidateWallet) {
          //     const balance =
          //       Number(foundCandidateWallet.balance) -
          //       Number(feeOfRecruitmentRequirement?.price);

          //     await foundCandidateWallet.update(
          //       {
          //         balance,
          //       },
          //       { transaction },
          //     );

          //     await this.walletHistoryRepository.create(
          //       {
          //         wallet_id: foundCandidateWallet.id,
          //         type: WALLET_TYPE.SUB,
          //         value: Number(feeOfRecruitmentRequirement?.price),
          //         current_balance: balance > 0 ? balance : 0,
          //         mutable_type:
          //           feeOfRecruitmentRequirement?.fee_type_id === FEE_TYPE.CV
          //             ? WALLET_MUTABLE_TYPE.CV
          //             : WALLET_MUTABLE_TYPE.HUNT,
          //         created_by: user_id,
          //         candidate_information_id:
          //           candidateRecruitment.candidate_information_id,
          //         recruitment_requirement_id:
          //           candidateRecruitment.recruitment_requirement_id,
          //       },
          //       { transaction },
          //     );
          //   }
          // }
        }

        await this.recruitmentRequirementHistoryRepository.create(
          {
            recruitment_requirement_id:
              candidateRecruitment.recruitment_requirement_id,
            status: RECRUITMENT_STATUS.UPDATE_CANDIDATE_STATUS,
            created_by: user_id,
            candidate_information_id: candidate.id,
            candidate_recruitment_status: dto.status,
            note: dto.note || null,
          },
          { transaction },
        );

        //Cập nhật timeline trạng thái
        await TimelineStatus.create(
          {
            candidate_recruitment_id: candidateRecruitment.id,
            candidate_information_id:
              candidateRecruitment.candidate_information_id,
            candidate_info_review_id:
              candidateRecruitment.candidate_info_review_id || null,
            status: dto?.status,
            modify_date: new Date(),
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
    await wallet.reload();
    if (
      isUpdateWallet &&
      feeOfRecruitmentRequirement &&
      Number(feeOfRecruitmentRequirement.price) > 0
    ) {
      let title;
      let textInput;
      let note;
      if (mutableType == WALLET_MUTABLE_TYPE.CV) {
        title = `Trừ ${feeOfRecruitmentRequirement?.price} tiền CV ứng viên ${candidate.user.full_name}`;
        textInput = `${candidate.user.full_name} đã phỏng vấn thành công`;
        note = `Trừ tiền CV ứng viên ${candidate.user.full_name}`;
      } else {
        title = `Trừ ${feeOfRecruitmentRequirement?.price} tiền tuyển ứng viên ${candidate.user.full_name}`;
        textInput = `${candidate.user.full_name} đã nhận việc tại công ty`;
        note = `Trừ tiền tuyển ứng viên ${candidate.user.full_name}`;
      }
      const notificationPayload: NotificationPayload = {
        title,
        content: title,
        type: NOTIFICATION_TYPE.WALLET,
        data: {
          recruitment_id: recruitmentRequirement.id,
          candidate_recruitment_id: candidateRecruitment.id,
          user_id: recruitmentRequirement.enterprise.user.id,
        },
      };
      this.notificationService.createAndSendNotificationForUsers(
        notificationPayload,
        {
          include_user_ids: [recruitmentRequirement.enterprise.user.id],
        },
      );
      if (recruitmentRequirement?.enterprise?.user?.email) {
        await this.mailService.updateSubWalletRecruitmentToEnterprise({
          receiver_email: recruitmentRequirement.enterprise.user.email,
          subject: `[Alehub] Thông báo trừ tiền`,
          text: {
            logo_url: configService.getEnv('LOGO_URL'),
            recruitment_code: recruitmentRequirement.code,
            recruitment_id: recruitmentRequirement.id,
            candidate_name: candidate.user.full_name,
            webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
            enterprise_name: recruitmentRequirement.enterprise.name,
            value: feeOfRecruitmentRequirement?.price,
            balance: wallet.balance,
            time: dayjs().format('HH:mm:ss DD-MM-YYYY'),
            text_input: textInput,
            note,
          },
        });
      }
    }

    if (
      isUpdateHroWallet &&
      feeOfRecruitmentRequirementHro &&
      Number(feeOfRecruitmentRequirementHro.price) > 0
    ) {
      if (mutableType == WALLET_MUTABLE_TYPE.CV) {
        const notificationPayload: NotificationPayload = {
          title: `Cộng ${feeOfRecruitmentRequirementHro.price} tiền CV ứng viên ${candidate.user.full_name}`,
          content: `Cộng ${feeOfRecruitmentRequirementHro.price} tiền CV ứng viên ${candidate.user.full_name}`,
          type: NOTIFICATION_TYPE.WALLET,
          data: {
            recruitment_id: recruitmentRequirement.id,
            candidate_recruitment_id: candidateRecruitment.id,
            user_id: recruitmentRequirement.enterprise.user.id,
          },
        };
        if (foundUserCreated) {
          this.notificationService.createAndSendNotificationForUsers(
            notificationPayload,
            {
              include_user_ids: [foundUserCreated.id],
            },
          );
          if (foundUserCreated?.email) {
            await this.mailService.adminUpdateAddWalletApproveCVToHRO({
              receiver_email: foundUserCreated.email,
              subject: `[Alehub] Thông báo cộng tiền`,
              text: {
                logo_url: configService.getEnv('LOGO_URL'),
                hro_name: foundUserCreated.full_name,
                candidate_name: candidate.user.full_name,
                webLoginAdmin: configService.getEnv('WEB_ADMIN'),
                value: feeOfRecruitmentRequirementHro?.price,
                balance: foundHroWallet?.balance,
                time: dayjs().format('HH:mm:ss DD-MM-YYYY'),
                hro_id: foundUserCreated.id,
              },
            });
          }
        }
      } else {
        const notificationPayload: NotificationPayload = {
          title: `Cộng ${feeOfRecruitmentRequirementHro.price} tiền tuyển ứng viên ${candidate.user.full_name}`,
          content: `Cộng ${feeOfRecruitmentRequirementHro.price} tiền tuyển ứng viên ${candidate.user.full_name}`,
          type: NOTIFICATION_TYPE.WALLET,
          data: {
            recruitment_id: recruitmentRequirement.id,
            candidate_recruitment_id: candidateRecruitment.id,
            user_id: recruitmentRequirement.enterprise.user.id,
          },
        };
        if (foundUserCreated) {
          this.notificationService.createAndSendNotificationForUsers(
            notificationPayload,
            {
              include_user_ids: [foundUserCreated.id],
            },
          );
          if (foundUserCreated?.email) {
            await this.mailService.adminUpdateAddWalletGetJobToHRO({
              receiver_email: foundUserCreated.email,
              subject: `[Alehub] Thông báo cộng tiền`,
              text: {
                logo_url: configService.getEnv('LOGO_URL'),
                hro_name: foundUserCreated.full_name,
                candidate_name: candidate.user.full_name,
                webLoginAdmin: configService.getEnv('WEB_ADMIN'),
                value: feeOfRecruitmentRequirementHro?.price,
                balance: foundHroWallet?.balance,
                time: dayjs().format('HH:mm:ss DD-MM-YYYY'),
                hro_id: foundUserCreated.id,
              },
            });
          }
        }
      }
    }

    if (dto.status == CANDIDATE_RECRUITMENT_STATUS.APPROVE_CV) {
      const notificationPayload: NotificationPayload = {
        title: `Cập nhật trạng thái: Ứng viên ${candidate.user.full_name} được chọn`,
        content: `Cập nhật trạng thái: Ứng viên ${candidate.user.full_name} được chọn`,
        type: NOTIFICATION_TYPE.UPDATE_CANDIDATE_RECRUITMENT_STATUS,
        data: {
          recruitment_id: recruitmentRequirement.id,
          candidate_recruitment_id: candidateRecruitment.id,
        },
      };
      this.notificationService.createAndSendNotificationForUsers(
        notificationPayload,
        {
          include_user_ids: [recruitmentRequirement.enterprise.user.id],
        },
      );
      if (recruitmentRequirement?.enterprise?.user?.email) {
        await this.mailService.sendChangeStatusApproveCVCandidateRecruitmentToEnterprise(
          {
            receiver_email: recruitmentRequirement.enterprise.user.email,
            subject: `[Alehub] Cập nhật trạng thái ứng viên trong yêu cầu tuyển dụng`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              recruitment_code: recruitmentRequirement.code,
              recruitment_id: recruitmentRequirement.id,
              candidate_name: candidate.user.full_name,
              webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
            },
          },
        );
      }
      if (candidate.created_by) {
        const foundHro = await this.userRepository.findOne({
          where: {
            id: candidate.created_by,
          },
        });
        if (foundHro && foundHro.role_id == ROLE.HRO) {
          // send notification to HRO
          const hroNotificationPayload: NotificationPayload = {
            title: `Cập nhật trạng thái: Ứng viên ${candidate.user.full_name} đã được chọn `,
            content: `Cập nhật trạng thái: Ứng viên ${candidate.user.full_name} đã được chọn `,
            type: NOTIFICATION_TYPE.UPDATE_CANDIDATE_RECRUITMENT_STATUS,
            data: {
              recruitment_id: recruitmentRequirement.id,
              candidate_recruitment_id: candidateRecruitment.id,
            },
          };
          this.notificationService.createAndSendNotificationForUsers(
            hroNotificationPayload,
            {
              include_user_ids: [candidate.created_by],
            },
          );

          if (foundHro?.email) {
            await this.mailService.adminChooseCVCandidateInRecruitmentToHRO({
              receiver_email: foundHro.email,
              subject: `[Alehub] Cập nhật trạng thái ứng viên trong yêu cầu tuyển dụng`,
              text: {
                logo_url: configService.getEnv('LOGO_URL'),
                recruitment_code: recruitmentRequirement.code,
                recruitment_id: recruitmentRequirement.id,
                candidate_name: candidate.user.full_name,
                webLoginAdmin: configService.getEnv('WEB_ADMIN'),
              },
            });
          }
        }
      }
    } else if (dto.status == CANDIDATE_RECRUITMENT_STATUS.REJECT_CV) {
      const notificationPayload: NotificationPayload = {
        title: `Cập nhật trạng thái: Từ chối ứng viên ${candidate.user.full_name}`,
        content: `Cập nhật trạng thái: Từ chối ứng viên ${candidate.user.full_name}`,
        type: NOTIFICATION_TYPE.UPDATE_CANDIDATE_RECRUITMENT_STATUS,
        data: {
          recruitment_id: recruitmentRequirement.id,
          candidate_recruitment_id: candidateRecruitment.id,
        },
      };
      this.notificationService.createAndSendNotificationForUsers(
        notificationPayload,
        {
          include_user_ids: [recruitmentRequirement.enterprise.user.id],
        },
      );
      if (recruitmentRequirement?.enterprise?.user?.email) {
        await this.mailService.sendChangeStatusRejectCVCandidateRecruitmentToEnterprise(
          {
            receiver_email: recruitmentRequirement.enterprise.user.email,
            subject: `[Alehub] Cập nhật trạng thái ứng viên trong yêu cầu tuyển dụng`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              recruitment_code: recruitmentRequirement.code,
              recruitment_id: recruitmentRequirement.id,
              candidate_name: candidate.user.full_name,
              webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
            },
          },
        );
      }
    } else if (dto.status == CANDIDATE_RECRUITMENT_STATUS.SCHEDULE_INTERVIEW) {
      const candidateInterview =
        await this.candidateInterviewRepository.findOne({
          where: {
            candidate_recruitment_id: candidateRecruitment.id,
          },
        });
      const notificationPayload: NotificationPayload = {
        title: `Cập nhật trạng thái: Chờ phỏng vấn ứng viên ${candidate.user.full_name}`,
        content: `Cập nhật trạng thái: Chờ phỏng vấn ứng viên ${candidate.user.full_name}`,
        type: NOTIFICATION_TYPE.UPDATE_CANDIDATE_RECRUITMENT_STATUS,
        data: {
          recruitment_id: recruitmentRequirement.id,
          candidate_recruitment_id: candidateRecruitment.id,
        },
      };
      this.notificationService.createAndSendNotificationForUsers(
        notificationPayload,
        {
          include_user_ids: [recruitmentRequirement.enterprise.user.id],
        },
      );
      if (candidateInterview) {
        const foundProvince = await this.dFProvinceRepository.findOne({
          where: { id: candidateInterview.df_province_id },
        });
        const address = candidateInterview.address + ' ' + foundProvince?.name;
        let receiverEmail = recruitmentRequirement.enterprise.user.email;
        if (candidateInterview.email) {
          receiverEmail = candidateInterview.email;
        }
        await this.mailService.sendChangeStatusScheduleInterviewCandidateRecruitmentToEnterprise(
          {
            receiver_email: receiverEmail,
            subject: `[Alehub] Hẹn lịch phỏng vấn ứng viên`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              recruitment_code: recruitmentRequirement.code,
              recruitment_id: recruitmentRequirement.id,
              candidate_name: candidate.user.full_name,
              webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
              enterprise_name: recruitmentRequirement.enterprise?.name,
              position: recruitmentRequirement.professional_field_input,
              time: dayjs(candidateInterview.schedule).format(
                'HH:mm:ss DD-MM-YYYY',
              ),
              address,
            },
          },
        );

        //send email cho ứng viên
        if (candidate?.user?.email) {
          await this.mailService.sendChangeStatusScheduleInterviewCandidateRecruitmentToCandidate(
            {
              receiver_email: candidate.user.email,
              subject: `[Alehub] Thư mời phỏng vấn`,
              text: {
                logo_url: configService.getEnv('LOGO_URL'),
                candidate_name: candidate.user.full_name,
                enterprise_name: recruitmentRequirement.enterprise?.name,
                position: recruitmentRequirement.professional_field_input,
                time: dayjs(candidateInterview.schedule).format(
                  'HH:mm:ss DD-MM-YYYY',
                ),
                address,
              },
            },
          );
        }
        
      }
    } else if (
      dto.status == CANDIDATE_RECRUITMENT_STATUS.RE_SCHEDULE_INTERVIEW
    ) {
      const candidateInterview =
        await this.candidateInterviewRepository.findOne({
          where: {
            candidate_recruitment_id: candidateRecruitment.id,
          },
        });
      const notificationPayload: NotificationPayload = {
        title: `Hẹn lại lịch phỏng vấn ứng viên ${candidate.user.full_name}`,
        content: `Hẹn lại lịch phỏng vấn ứng viên ${candidate.user.full_name}`,
        type: NOTIFICATION_TYPE.UPDATE_CANDIDATE_RECRUITMENT_STATUS,
        data: {
          recruitment_id: recruitmentRequirement.id,
          candidate_recruitment_id: candidateRecruitment.id,
        },
      };
      this.notificationService.createAndSendNotificationForUsers(
        notificationPayload,
        {
          include_user_ids: [recruitmentRequirement.enterprise.user.id],
        },
      );
      if (candidateInterview) {
        const foundProvince = await this.dFProvinceRepository.findOne({
          where: { id: candidateInterview.df_province_id },
        });
        const address = candidateInterview.address + ' ' + foundProvince?.name;

        let receiverEmail = recruitmentRequirement.enterprise.user.email;
        if (candidateInterview.email) {
          receiverEmail = candidateInterview.email;
        }
        await this.mailService.sendChangeStatusReScheduleInterviewCandidateRecruitmentToEnterprise(
          {
            receiver_email: receiverEmail,
            subject: `[Alehub] Hẹn lại lịch phỏng vấn ứng viên`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              recruitment_code: recruitmentRequirement.code,
              recruitment_id: recruitmentRequirement.id,
              candidate_name: candidate.user.full_name,
              webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
              enterprise_name: recruitmentRequirement.enterprise?.name,
              position: recruitmentRequirement.professional_field_input,
              time: dayjs(candidateInterview.schedule).format(
                'HH:mm:ss DD-MM-YYYY',
              ),
              address,
            },
          },
        );

        //send email cho ứng viên
        if (candidate?.user?.email) {
          await this.mailService.sendChangeStatusReScheduleInterviewCandidateRecruitmentToCandidate(
            {
              receiver_email: candidate.user.email,
              subject: `[Alehub] Thư hẹn lại lịch phỏng vấn`,
              text: {
                logo_url: configService.getEnv('LOGO_URL'),
                candidate_name: candidate.user.full_name,
                enterprise_name: recruitmentRequirement.enterprise?.name,
                position: recruitmentRequirement.professional_field_input,
                time: dayjs(candidateInterview.schedule).format(
                  'HH:mm:ss DD-MM-YYYY',
                ),
                address,
              },
            },
          );
        }
    
      }
    } else if (
      dto.status == CANDIDATE_RECRUITMENT_STATUS.SUCCESSFUL_INTERVIEW
    ) {
      const notificationPayload: NotificationPayload = {
        title: `Đã phỏng vấn thành công ứng viên ${candidate.user.full_name}`,
        content: `Đã phỏng vấn thành công ứng viên ${candidate.user.full_name}`,
        type: NOTIFICATION_TYPE.UPDATE_CANDIDATE_RECRUITMENT_STATUS,
        data: {
          recruitment_id: recruitmentRequirement.id,
          candidate_recruitment_id: candidateRecruitment.id,
        },
      };
      this.notificationService.createAndSendNotificationForUsers(
        notificationPayload,
        {
          include_user_ids: [recruitmentRequirement.enterprise.user.id],
        },
      );
      if (recruitmentRequirement?.enterprise?.user?.email) {
        await this.mailService.sendChangeStatusSuccessInterviewCandidateRecruitmentToEnterprise(
          {
            receiver_email: recruitmentRequirement.enterprise.user.email,
            subject: `[Alehub] Cập nhật kết quả phỏng vấn ứng viên`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              recruitment_code: recruitmentRequirement.code,
              recruitment_id: recruitmentRequirement.id,
              candidate_name: candidate.user.full_name,
              webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
              enterprise_name: recruitmentRequirement.enterprise?.name,
              position: recruitmentRequirement.professional_field_input,
            },
          },
        );
      }
      // send email to candidate
      if (candidate?.user?.email) {
        await this.mailService.sendChangeStatusSuccessInterviewCandidateRecruitmentToCandidate(
          {
            receiver_email: candidate.user.email,
            subject: `[Alehub] Thông báo kết quả phỏng vấn`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              candidate_name: candidate.user.full_name,
              webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
              enterprise_name: recruitmentRequirement.enterprise?.name,
              position: recruitmentRequirement.professional_field_input,
            },
          },
        );
      }
    } else if (dto.status == CANDIDATE_RECRUITMENT_STATUS.FAIL_INTERVIEW) {
      const notificationPayload: NotificationPayload = {
        title: `Ứng viên ${candidate.user.full_name} không đến phỏng vấn`,
        content: `Ứng viên ${candidate.user.full_name} không đến phỏng vấn`,
        type: NOTIFICATION_TYPE.UPDATE_CANDIDATE_RECRUITMENT_STATUS,
        data: {
          recruitment_id: recruitmentRequirement.id,
          candidate_recruitment_id: candidateRecruitment.id,
        },
      };
      this.notificationService.createAndSendNotificationForUsers(
        notificationPayload,
        {
          include_user_ids: [recruitmentRequirement.enterprise.user.id],
        },
      );

      if (recruitmentRequirement?.enterprise?.user?.email) {
        await this.mailService.sendChangeStatusFailInterviewCandidateRecruitmentToEnterprise(
          {
            receiver_email: recruitmentRequirement.enterprise.user.email,
            subject: `[Alehub] Cập nhật trạng thái phỏng vấn ứng viên`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              recruitment_code: recruitmentRequirement.code,
              recruitment_id: recruitmentRequirement.id,
              candidate_name: candidate.user.full_name,
              webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
              enterprise_name: recruitmentRequirement.enterprise?.name,
            },
          },
        );
      }
    } else if (dto.status == CANDIDATE_RECRUITMENT_STATUS.GET_A_JOB) {
      const notificationPayload: NotificationPayload = {
        title: `Ứng viên ${candidate.user.full_name} đồng ý nhận việc`,
        content: `Ứng viên ${candidate.user.full_name} đồng ý nhận việc`,
        type: NOTIFICATION_TYPE.UPDATE_CANDIDATE_RECRUITMENT_STATUS,
        data: {
          recruitment_id: recruitmentRequirement.id,
          candidate_recruitment_id: candidateRecruitment.id,
        },
      };
      this.notificationService.createAndSendNotificationForUsers(
        notificationPayload,
        {
          include_user_ids: [recruitmentRequirement.enterprise.user.id],
        },
      );

      if (recruitmentRequirement?.enterprise?.user?.email) {
        await this.mailService.sendChangeStatusGetAJobCandidateRecruitmentToEnterprise(
          {
            receiver_email: recruitmentRequirement.enterprise.user.email,
            subject: `[Alehub] Thông báo kết quả nhận việc`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              recruitment_code: recruitmentRequirement.code,
              recruitment_id: recruitmentRequirement.id,
              candidate_name: candidate.user.full_name,
              webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
              enterprise_name: recruitmentRequirement.enterprise?.name,
            },
          },
        );
      }
      // send email to candidate
      if (candidate?.user?.email) {
        await this.mailService.sendChangeStatusGetAJobCandidateRecruitmentToCandidate(
          {
            receiver_email: candidate.user.email,
            subject: `[Alehub] Thông báo kết quả nhận việc`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              candidate_name: candidate.user.full_name,
              enterprise_name: recruitmentRequirement.enterprise?.name,
            },
          },
        );
      }
    } else if (dto.status == CANDIDATE_RECRUITMENT_STATUS.DO_NOT_GET_A_JOB) {
      const notificationPayload: NotificationPayload = {
        title: `Ứng viên ${candidate.user.full_name} đã từ chối nhận việc`,
        content: `Ứng viên ${candidate.user.full_name} đã từ chối nhận việc`,
        type: NOTIFICATION_TYPE.UPDATE_CANDIDATE_RECRUITMENT_STATUS,
        data: {
          recruitment_id: recruitmentRequirement.id,
          candidate_recruitment_id: candidateRecruitment.id,
        },
      };
      this.notificationService.createAndSendNotificationForUsers(
        notificationPayload,
        {
          include_user_ids: [recruitmentRequirement.enterprise.user.id],
        },
      );

      if (recruitmentRequirement?.enterprise?.user?.email) {
        await this.mailService.sendChangeStatusNotGetAJobCandidateRecruitmentToEnterprise(
          {
            receiver_email: recruitmentRequirement.enterprise.user.email,
            subject: `[Alehub] Thông báo từ chối nhận việc ứng viên ${candidate.user.full_name}`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              recruitment_code: recruitmentRequirement.code,
              recruitment_id: recruitmentRequirement.id,
              candidate_name: candidate.user.full_name,
              webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
              enterprise_name: recruitmentRequirement.enterprise?.name,
              note: dto.note,
            },
          },
        );
      }
    }

    // auto change status of recruitment requirement
    const feeOfRecruitment =
      await this.feeOfRecruitmentRequirementRepository.findOne({
        where: {
          recruitment_requirement_id:
            candidateRecruitment.recruitment_requirement_id,
        },
      });
    if (feeOfRecruitment) {
      let listStatus: number[] = [];
      let condition = false;
      const listCandidateRecruitment =
        await this.candidateRecruitmentRepository.findAll({
          where: {
            recruitment_requirement_id:
              candidateRecruitment.recruitment_requirement_id,
          },
        });
      if (listCandidateRecruitment && listCandidateRecruitment.length > 0) {
        listStatus = listCandidateRecruitment.map((e) => e.status);
      }
      if (feeOfRecruitment.fee_type_id == FEE_TYPE.CV) {
        condition = listStatus.every(
          (element) =>
            element === CANDIDATE_RECRUITMENT_STATUS.SUCCESSFUL_INTERVIEW ||
            element === CANDIDATE_RECRUITMENT_STATUS.FAIL_INTERVIEW,
        );
      } else {
        condition = listStatus.every(
          (element) =>
            element === CANDIDATE_RECRUITMENT_STATUS.GET_A_JOB ||
            element === CANDIDATE_RECRUITMENT_STATUS.DO_NOT_GET_A_JOB,
        );
      }
      if (condition) {
        await this.recruitmentRequirementRepository.update(
          {
            status: RECRUITMENT_STATUS.COMPLETED,
          },
          {
            where: {
              id: candidateRecruitment.recruitment_requirement_id,
            },
          },
        );
      }
    }

    return sendSuccess({
      data: candidateRecruitment,
      msg: 'Thay đổi trạng thái thành công',
    });
  }

  async delete(id: number, user_id: number) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
    });
    if (!foundUser) {
      throw new HttpException(
        'Người dùng không tồn tại trong hệ thống!',
        HttpStatus.NOT_FOUND,
      );
    }
    const candidateRecruitment =
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
    const foundRecruitment =
      await this.recruitmentRequirementRepository.findOne({
        where: {
          id: candidateRecruitment.recruitment_requirement_id,
        },
      });
    if (!foundRecruitment) {
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
      (value) => foundRecruitment.status === value,
    );

    if (isMatchRecruitmentStatus) {
      throw new HttpException(
        'Không được phép xóa ứng viên trong yêu cầu với các trạng thái Từ chối và Hoàn thành.',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await candidateRecruitment.destroy({ transaction });
        await this.candidateInterviewRepository.destroy({
          where: {
            candidate_recruitment_id: id,
          },
          transaction,
        });
        await this.recruitmentRequirementHistoryRepository.create(
          {
            recruitment_requirement_id:
              candidateRecruitment.recruitment_requirement_id,
            status: RECRUITMENT_STATUS.DELETE_CANDIDATE,
            created_by: user_id,
            candidate_information_id: foundCandidate.id,
          },
          { transaction },
        );
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể xóa ứng viên trong yêu cầu tuyển dụng lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    const foundCreatedCandidate = await this.userRepository.findOne({
      where: {
        id: foundCandidate.created_by,
        role_id: ROLE.HRO,
        status: USER_STATUS.ACTIVE,
      },
    });
    if (foundCreatedCandidate && foundCreatedCandidate.role_id == ROLE.HRO) {
      if (candidateRecruitment.created_by != foundCreatedCandidate.id) {
        const foundConfigPoint = await this.configPointHroRepository.findOne(
          {},
        );
        const foundUserPoint = await this.userPointRepository.findOne({
          where: {
            user_id: foundCreatedCandidate.id,
          },
        });
        if (foundUserPoint && foundConfigPoint) {
          const point =
            Number(foundUserPoint.point) - Number(foundConfigPoint.point);
          await foundUserPoint.update({
            point,
          });
          await this.userPointHistoryRepository.create({
            user_point_id: foundUserPoint?.id,
            type: WALLET_TYPE.SUB,
            mutable_type: POINT_MUTABLE_TYPE.REMOVE_CV,
            value: foundConfigPoint.point,
            current_point: point,
            created_by: user_id,
            recruitment_requirement_id: foundRecruitment.id,
            candidate_information_id: foundCandidate.id,
          });

          // Push notification to HRO
          const notificationPayload: NotificationPayload = {
            title: `Trừ ${foundConfigPoint?.point} điểm của ứng viên ${foundCandidate.user.full_name} ở yêu cầu tuyển dụng ${foundRecruitment.code}`,
            content: `Trừ ${foundConfigPoint?.point} điểm của ứng viên ${foundCandidate.user.full_name} ở yêu cầu tuyển dụng ${foundRecruitment.code}`,
            type: NOTIFICATION_TYPE.POINT,
            data: {
              recruitment_id: foundRecruitment.id,
              user_id: foundCreatedCandidate.id,
            },
          };
          this.notificationService.createAndSendNotificationForUsers(
            notificationPayload,
            {
              include_user_ids: [foundCreatedCandidate.id],
            },
          );
          if (foundCreatedCandidate?.email) {
            await this.mailService.sendSubUserPointOfHROToHRO({
              receiver_email: foundCreatedCandidate.email,
              subject: '[Alehub] Thông báo trừ điểm ',
              text: {
                logo_url: configService.getEnv('LOGO_URL'),
                hro_name: foundCreatedCandidate.full_name,
                candidate_name: foundCandidate.user.full_name,
                recruitment_code: foundRecruitment.code,
                created_name: foundUser.full_name,
                value: foundConfigPoint?.point,
                point,
                time: dayjs().format('HH:mm:ss DD-MM-YYYY'),
                note: `Xóa ứng viên ${foundCandidate.user.full_name} khỏi yêu cầu tuyển dụng ${foundRecruitment.code}`,
                webLoginAdmin: configService.getEnv('WEB_ADMIN'),
                hro_id: foundCreatedCandidate.id,
              },
            });
          }
        }
      }
    }

    return sendSuccess({
      msg: 'Xóa ứng viên trong yêu cầu tuyển dụng thành công',
    });
  }
}
