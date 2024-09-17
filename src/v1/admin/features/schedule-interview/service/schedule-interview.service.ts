import { HttpException, HttpStatus } from '@nestjs/common';
// Nest dependencies
import { Injectable } from '@nestjs/common';
// Other dependencies
import { Op, Transaction } from 'sequelize';
// Local files
import { CandidateInformation } from '@models/candidate-information.model';
import { CandidateRecruitment } from '@models/candidate-recruitment.model';
import { Enterprise } from '@models/enterprise.model';
import { ProfessionalField } from '@models/professional-field.model';
import { RecruitmentRequirement } from '@models/recruitment-requirement.model';
import { User } from '@models/user.model';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateInterviewRepository } from '@repositories/candidate-interview.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { RecruitmentRequirementImplementationRepository } from '@repositories/recruitment-requirement-implementation.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { UserRepository } from '@repositories/user.repository';
import { configService } from '@services/config.service';
import { MailService } from '@services/mail.service';
import { NotificationService } from '@services/notification.service';
import {
  CANDIDATE_RECRUITMENT_STATUS,
  IS_ACTIVE,
  NOTIFICATION_TYPE,
  NotificationPayload,
  ROLE,
} from '@utils/constants';
import { convertDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import * as dayjs from 'dayjs';
import { Sequelize } from 'sequelize-typescript';
import { AdminCreateScheduleInterviewDto } from '../dto/create-schedule-interview.dto';
import { AdminFilterScheduleInterviewDto } from '../dto/filter-schedule-interview.dto';
import { AdminUpdateScheduleInterviewDto } from '../dto/update-schedule-interview.dto';

@Injectable()
export class AdminScheduleInterviewService {
  constructor(
    private readonly candidateRecruitmentRepository: CandidateRecruitmentRepository,
    private readonly candidateInterviewRepository: CandidateInterviewRepository,
    private readonly candidateInformationRepository: CandidateInformationRepository,
    private readonly dfProvinceRepository: DFProvinceRepository,
    private readonly recruitmentRequirementRepository: RecruitmentRequirementRepository,
    private readonly userRepository: UserRepository,
    private readonly recruitmentRequirementImplementationRepository: RecruitmentRequirementImplementationRepository,
    private readonly notificationService: NotificationService,
    private readonly mailService: MailService,
    private readonly sequelize: Sequelize,
  ) {}
  async findAll(user_id: number, dto: AdminFilterScheduleInterviewDto) {
    const foundUser = await this.userRepository.findByPk(user_id);
    if (!foundUser) {
      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    // const fromDate = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss');
    // const toDate = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss');
    const whereCondition: any = {
      //schedule: { [Op.between]: [fromDate, toDate] },
      [Op.and]: [],
    };

    if (foundUser.role_id == ROLE.RESPONSIBLE_SALE) {
      const recruitment = await this.recruitmentRequirementRepository.findAll({
        where: {
          [Op.or]: [
            { responsible_sale_id: user_id },
            {
              created_by: user_id,
            },
          ],
        },
      });

      if (recruitment && recruitment.length > 0) {
        const recruitmentRequirementIDs = recruitment.map((e) => e.id);
        const candidateRecruitment =
          await this.candidateRecruitmentRepository.findAll({
            where: {
              recruitment_requirement_id: {
                [Op.in]: recruitmentRequirementIDs,
              },
            },
          });
        if (candidateRecruitment && candidateRecruitment.length > 0) {
          const candidateRecruitmentIDs = candidateRecruitment.map((e) => e.id);
          whereCondition[Op.and].push({
            candidate_recruitment_id: {
              [Op.in]: candidateRecruitmentIDs,
            },
          });
        } else {
          whereCondition[Op.and].push({
            candidate_recruitment_id: {
              [Op.in]: [],
            },
          });
        }
      } else {
        whereCondition[Op.and].push({
          candidate_recruitment_id: {
            [Op.in]: [],
          },
        });
      }
    } else if (foundUser.role_id == ROLE.IMPLEMENTATION_SALE) {
      const foundImplementations =
        await this.recruitmentRequirementImplementationRepository.findAll({
          where: {
            user_id,
          },
        });
      if (foundImplementations && foundImplementations.length > 0) {
        const recruitment = await this.recruitmentRequirementRepository.findAll(
          {
            where: {
              id: {
                [Op.in]: foundImplementations.map(
                  (e) => e.recruitment_requirement_id,
                ),
              },
            },
          },
        );
        if (recruitment && recruitment.length > 0) {
          const recruitmentRequirementIDs = recruitment.map((e) => e.id);
          const candidateRecruitment =
            await this.candidateRecruitmentRepository.findAll({
              where: {
                recruitment_requirement_id: {
                  [Op.in]: recruitmentRequirementIDs,
                },
              },
            });
          if (candidateRecruitment && candidateRecruitment.length > 0) {
            const candidateRecruitmentIDs = candidateRecruitment.map(
              (e) => e.id,
            );
            whereCondition[Op.and].push({
              candidate_recruitment_id: {
                [Op.in]: candidateRecruitmentIDs,
              },
            });
          } else {
            whereCondition[Op.and].push({
              candidate_recruitment_id: {
                [Op.in]: [],
              },
            });
          }
        }
      } else {
        whereCondition[Op.and].push({
          candidate_recruitment_id: {
            [Op.in]: [],
          },
        });
      }
    } else if (foundUser.role_id == ROLE.HRO) {
      const foundCandidate = await this.candidateInformationRepository.findAll({
        where: {
          created_by: foundUser.id,
        },
      });
      const candidateIDs = foundCandidate?.map((e) => e.id);
      whereCondition.candidate_information_id = { [Op.in]: candidateIDs };
    }

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.schedule = { [Op.between]: [fromDate, toDate] };
    }
    if (dto.candidate_id) {
      whereCondition.candidate_information_id = dto.candidate_id;
    }
    if (dto.enterprise_id) {
      const recruitmentRequirement =
        await this.recruitmentRequirementRepository.findAll({
          where: { enterprise_id: dto.enterprise_id },
        });
      if (recruitmentRequirement && recruitmentRequirement.length > 0) {
        const recruitmentRequirementIDs = recruitmentRequirement.map(
          (e) => e.id,
        );
        const candidateRecruitment =
          await this.candidateRecruitmentRepository.findAll({
            where: {
              recruitment_requirement_id: {
                [Op.in]: recruitmentRequirementIDs,
              },
            },
          });
        if (candidateRecruitment && candidateRecruitment.length > 0) {
          const candidateRecruitmentIDs = candidateRecruitment.map((e) => e.id);
          whereCondition[Op.and].push({
            candidate_recruitment_id: {
              [Op.in]: candidateRecruitmentIDs,
            },
          });
        } else {
          whereCondition[Op.and].push({
            candidate_recruitment_id: {
              [Op.in]: [],
            },
          });
        }
      }
    }
    if (dto.recruitment_requirement_id) {
      const candidateRecruitment =
        await this.candidateRecruitmentRepository.findAll({
          where: { recruitment_requirement_id: dto.recruitment_requirement_id },
        });
      if (candidateRecruitment && candidateRecruitment.length > 0) {
        const candidateRecruitmentIDs = candidateRecruitment.map((e) => e.id);
        whereCondition[Op.and].push({
          candidate_recruitment_id: {
            [Op.in]: candidateRecruitmentIDs,
          },
        });
      } else {
        whereCondition[Op.and].push({
          candidate_recruitment_id: {
            [Op.in]: [],
          },
        });
      }
    }
    const options: any = {
      subQuery: false,
      where: whereCondition,
      include: [
        {
          model: CandidateInformation,
          as: 'candidate_information',
          include: [
            {
              model: User,
            },
          ],
        },
        {
          model: CandidateRecruitment,
          include: {
            model: RecruitmentRequirement,
            include: [{ model: Enterprise }, { model: User }],
          },
        },
      ],
      order: [['id', 'DESC']],
    };
    const count = await this.candidateInterviewRepository.count(options);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const candidateInterview = await this.candidateInterviewRepository.findAll(
      options,
    );
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({ data: candidateInterview, paging });
  }

  async create(dto: AdminCreateScheduleInterviewDto) {
    if (dto.df_province_id) {
      const province = await this.dfProvinceRepository.findProvince(
        dto.df_province_id,
      );

      if (!province) {
        throw new HttpException(
          'Khu vực làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    const candidateRecruitment =
      await this.candidateRecruitmentRepository.findOne({
        where: { id: dto.candidate_recruitment_id },
      });
    if (!candidateRecruitment) {
      throw new HttpException(
        'Không tồn tài ứng viên trong yêu cầu tuyển dụng',
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
    const candidate = await this.candidateInformationRepository.findOne({
      where: { id: candidateRecruitment.candidate_information_id },
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

    const candidateInterview = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        const candidateInterview =
          await this.candidateInterviewRepository.create(
            {
              df_province_id: dto.df_province_id,
              candidate_recruitment_id: dto.candidate_recruitment_id,
              candidate_information_id: candidate.id,
              phone_number: dto.phone_number,
              interviewer: dto.interviewer,
              is_online: dto.is_online || null,
              schedule: dto.schedule,
              address: dto.address,
              note: dto.note,
              email: dto.email || null,
            },
            { transaction },
          );
        if (dto.is_change_status == IS_ACTIVE.ACTIVE) {
          await candidateRecruitment.update(
            {
              status: CANDIDATE_RECRUITMENT_STATUS.SCHEDULE_INTERVIEW,
            },
            { transaction },
          );
        }
        return candidateInterview;
      },
    );
    if (candidateInterview) {
      if (
        dto.is_change_status == IS_ACTIVE.ACTIVE ||
        candidateRecruitment.status ==
          CANDIDATE_RECRUITMENT_STATUS.SCHEDULE_INTERVIEW
      ) {
        const notificationPayload: NotificationPayload = {
          title: `Cập nhật trạng thái: Chờ phỏng vấn ứng viên ${candidate.user.full_name}`,
          content: `Cập nhật trạng thái: Chờ phỏng vấn ứng viên ${candidate.user.full_name}`,
          type: NOTIFICATION_TYPE.UPDATE_CANDIDATE_RECRUITMENT_STATUS,
          data: {
            recruitment_id: recruitmentRequirement.id,
            candidate_recruitment_id: candidateInterview?.id,
          },
        };
        const foundProvince = await this.dfProvinceRepository.findOne({
          where: { id: candidateInterview?.df_province_id },
        });
        const address = candidateInterview?.address + ' ' + foundProvince?.name;

        this.notificationService.createAndSendNotificationForUsers(
          notificationPayload,
          {
            include_user_ids: [recruitmentRequirement.enterprise.user.id],
          },
        );
        let receiverEmail = recruitmentRequirement.enterprise.user.email;
        if (dto.email) {
          receiverEmail = dto.email;
        }
        this.mailService.sendChangeStatusScheduleInterviewCandidateRecruitmentToEnterprise(
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
              time: dayjs(candidateInterview?.schedule).format(
                'HH:mm:ss DD-MM-YYYY',
              ),
              address,
            },
          },
        );

        //send email cho ứng viên
        this.mailService.sendChangeStatusScheduleInterviewCandidateRecruitmentToCandidate(
          {
            receiver_email: candidate.user.email,
            subject: `[Alehub] Thư mời phỏng vấn`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              candidate_name: candidate.user.full_name,
              enterprise_name: recruitmentRequirement.enterprise?.name,
              position: recruitmentRequirement.professional_field_input,
              time: dayjs(candidateInterview?.schedule).format(
                'HH:mm:ss DD-MM-YYYY',
              ),
              address,
            },
          },
        );
    
      }
      if (
        candidateRecruitment.status ==
        CANDIDATE_RECRUITMENT_STATUS.RE_SCHEDULE_INTERVIEW
      ) {
        const notificationPayload: NotificationPayload = {
          title: `Hẹn lại lịch phỏng vấn ứng viên ${candidate.user.full_name}`,
          content: `Hẹn lại lịch phỏng vấn ứng viên ${candidate.user.full_name}`,
          type: NOTIFICATION_TYPE.UPDATE_CANDIDATE_RECRUITMENT_STATUS,
          data: {
            recruitment_id: recruitmentRequirement.id,
            candidate_recruitment_id: candidateRecruitment.id,
          },
        };
        const foundProvince = await this.dfProvinceRepository.findOne({
          where: { id: candidateInterview?.df_province_id },
        });
        const address = candidateInterview?.address + ' ' + foundProvince?.name;

        this.notificationService.createAndSendNotificationForUsers(
          notificationPayload,
          {
            include_user_ids: [recruitmentRequirement.enterprise.user.id],
          },
        );

        this.mailService.sendChangeStatusReScheduleInterviewCandidateRecruitmentToEnterprise(
          {
            receiver_email: recruitmentRequirement.enterprise.user.email,
            subject: `[Alehub] Hẹn lại lịch phỏng vấn ứng viên`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              recruitment_code: recruitmentRequirement.code,
              recruitment_id: recruitmentRequirement.id,
              candidate_name: candidate.user.full_name,
              webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
              enterprise_name: recruitmentRequirement.enterprise?.name,
              position: recruitmentRequirement.professional_field_input,
              time: dayjs(candidateInterview?.schedule).format(
                'HH:mm:ss DD-MM-YYYY',
              ),
              address,
            },
          },
        );

        //send email cho ứng viên
        this.mailService.sendChangeStatusReScheduleInterviewCandidateRecruitmentToCandidate(
          {
            receiver_email: candidate.user.email,
            subject: `[Alehub] Thư hẹn lại lịch phỏng vấn`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              candidate_name: candidate.user.full_name,
              enterprise_name: recruitmentRequirement.enterprise?.name,
              position: recruitmentRequirement.professional_field_input,
              time: dayjs(candidateInterview?.schedule).format(
                'HH:mm:ss DD-MM-YYYY',
              ),
              address,
            },
          },
        );
      }
    }
    return sendSuccess({ msg: 'Thêm mới lịch phỏng vấn thành công' });
  }

  async update(id: number, dto: AdminUpdateScheduleInterviewDto) {
    const foundCandidateInterview =
      await this.candidateInterviewRepository.findOne({
        where: { id },
      });
    if (!foundCandidateInterview) {
      throw new HttpException(
        'Lịch hẹn phỏng vấn của ứng viên không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    if (dto.df_province_id) {
      const province = await this.dfProvinceRepository.findProvince(
        dto.df_province_id,
      );

      if (!province) {
        throw new HttpException(
          'Khu vực làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const candidateRecruitment =
      await this.candidateRecruitmentRepository.findOne({
        where: { id: foundCandidateInterview.candidate_recruitment_id },
      });
    if (!candidateRecruitment) {
      throw new HttpException(
        'Không tồn tài ứng viên trong yêu cầu tuyển dụng',
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
            include: [{ model: User, as: 'user' }],
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
    const candidate = await this.candidateInformationRepository.findOne({
      where: { id: candidateRecruitment.candidate_information_id },
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

    await this.sequelize.transaction(async (transaction: Transaction) => {
      await foundCandidateInterview.update(
        {
          df_province_id: dto.df_province_id,
          phone_number: dto.phone_number,
          interviewer: dto.interviewer,
          is_online: dto.is_online || null,
          schedule: dto.schedule,
          address: dto.address,
          note: dto.note,
          email: dto.email || null,
        },
        { transaction },
      );
      if (dto.is_change_status == IS_ACTIVE.ACTIVE) {
        await candidateRecruitment.update(
          {
            status: CANDIDATE_RECRUITMENT_STATUS.RE_SCHEDULE_INTERVIEW,
          },
          { transaction },
        );
      }
    });
    await foundCandidateInterview.reload();
    if (dto.is_change_status == IS_ACTIVE.ACTIVE) {
      const notificationPayload: NotificationPayload = {
        title: `Hẹn lại lịch phỏng vấn ứng viên ${candidate.user.full_name}`,
        content: `Hẹn lại lịch phỏng vấn ứng viên ${candidate.user.full_name}`,
        type: NOTIFICATION_TYPE.UPDATE_CANDIDATE_RECRUITMENT_STATUS,
        data: {
          recruitment_id: recruitmentRequirement.id,
          candidate_recruitment_id: candidateRecruitment.id,
        },
      };
      const foundProvince = await this.dfProvinceRepository.findOne({
        where: { id: foundCandidateInterview.df_province_id },
      });
      const address =
        foundCandidateInterview.address + ' ' + foundProvince?.name;

      this.notificationService.createAndSendNotificationForUsers(
        notificationPayload,
        {
          include_user_ids: [recruitmentRequirement.enterprise.user.id],
        },
      );
      let receiverEmail = recruitmentRequirement.enterprise.user.email;
      if (dto.email) {
        receiverEmail = dto.email;
      }
      this.mailService.sendChangeStatusReScheduleInterviewCandidateRecruitmentToEnterprise(
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
            time: dayjs(foundCandidateInterview.schedule).format(
              'HH:mm:ss DD-MM-YYYY',
            ),
            address,
          },
        },
      );

      //send email cho ứng viên
      this.mailService.sendChangeStatusReScheduleInterviewCandidateRecruitmentToCandidate(
        {
          receiver_email: candidate.user.email,
          subject: `[Alehub] Thư hẹn lại lịch phỏng vấn`,
          text: {
            logo_url: configService.getEnv('LOGO_URL'),
            candidate_name: candidate.user.full_name,
            enterprise_name: recruitmentRequirement.enterprise?.name,
            position: recruitmentRequirement.professional_field_input,
            time: dayjs(foundCandidateInterview.schedule).format(
              'HH:mm:ss DD-MM-YYYY',
            ),
            address,
          },
        },
      );
    }

    return sendSuccess({ msg: 'Thay đổi lịch phỏng vấn thành công' });
  }
}
