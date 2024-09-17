// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
// Other dependencies
import * as dayjs from 'dayjs';
import { Sequelize } from 'sequelize-typescript';
// Local files
import { Enterprise } from '@models/enterprise.model';
import { ProfessionalField } from '@models/professional-field.model';
import { User } from '@models/user.model';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateInterviewRepository } from '@repositories/candidate-interview.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { InterestListTransactionRepository } from '@repositories/interest-list-transaction.repository';
import { InterestListRepository } from '@repositories/interest-list.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { UserRepository } from '@repositories/user.repository';
import { configService } from '@services/config.service';
import { MailService } from '@services/mail.service';
import { NotificationService } from '@services/notification.service';
import { NOTIFICATION_TYPE, NotificationPayload, ROLE } from '@utils/constants';
import { Op } from 'sequelize';

@Injectable()
export class ScheduleInterviewService {
  constructor(
    private readonly interestListRepository: InterestListRepository,
    private readonly interestListTransactionRepository: InterestListTransactionRepository,
    private readonly candidateInterviewRepository: CandidateInterviewRepository,
    private readonly sequelize: Sequelize,
    private readonly candidateInformationRepository: CandidateInformationRepository,
    private readonly recruitmentRequirementRepository: RecruitmentRequirementRepository,
    private readonly candidateRecruitmentRepository: CandidateRecruitmentRepository,
    private readonly notificationService: NotificationService,
    private readonly dFProvinceRepository: DFProvinceRepository,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async scheduleInterviewCron() {
    const fromDate = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const toDate = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    console.log('currentDate', { fromDate, toDate });
    const candidateInterviews = await this.candidateInterviewRepository.findAll(
      {
        where: {
          schedule: { [Op.between]: [fromDate, toDate] },
        },
      },
    );
    if (candidateInterviews && candidateInterviews.length > 0) {
      for (let index = 0; index < candidateInterviews.length; index++) {
        try {
          const time = dayjs(candidateInterviews[index].schedule).format(
            'HH:mm:ss DD-MM-YYYY',
          );
          const candidate = await this.candidateInformationRepository.findOne({
            where: {
              id: candidateInterviews[index].candidate_information_id,
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
          const candidateRecruitment =
            await this.candidateRecruitmentRepository.findOne({
              where: {
                id: candidateInterviews[index].candidate_recruitment_id,
              },
            });
          if (!candidateRecruitment) {
            throw new HttpException(
              'Ứng viên không tồn tại trong yêu cầu tuyển dụng',
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
                  include: [{ model: User }],
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
          const foundProvince = await this.dFProvinceRepository.findOne({
            where: { id: candidateInterviews[index].df_province_id },
          });
          const address =
            candidateInterviews[index].address + ' ' + foundProvince?.name;

          const notificationPayload: NotificationPayload = {
            title: `Nhắc hẹn phỏng vấn: ${time} - Ứng viên ${candidate.user.full_name} thuộc yêu cầu ${recruitmentRequirement.code}.`,
            content: `Nhắc hẹn phỏng vấn: ${time} - Ứng viên ${
              candidate.user.full_name
            },vị trí ${
              recruitmentRequirement.professional_field_input
                ? recruitmentRequirement.professional_field_input
                : ''
            } thuộc yêu cầu ${recruitmentRequirement.code}.`,
            type: NOTIFICATION_TYPE.REMIND_INTERVIEW,
            data: {
              recruitment_id: recruitmentRequirement.id,
              candidate_recruitment_id: candidateRecruitment.id,
            },
          };
          await this.notificationService.createAndSendNotificationForUsers(
            notificationPayload,
            {
              include_user_ids: [recruitmentRequirement.enterprise.user.id],
            },
          );
          if (recruitmentRequirement?.enterprise?.user?.email) {
            await this.mailService.sendRemindInterviewCandidateRecruitmentToEnterprise(
              {
                receiver_email: recruitmentRequirement.enterprise.user.email,
                subject: `[Alehub] Nhắc hẹn phỏng vấn ứng viên`,
                text: {
                  logo_url: configService.getEnv('LOGO_URL'),
                  recruitment_code: recruitmentRequirement.code,
                  recruitment_id: recruitmentRequirement.id,
                  candidate_name: candidate.user.full_name,
                  webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
                  enterprise_name: recruitmentRequirement.enterprise.name,
                  position: recruitmentRequirement.professional_field_input,
                  time: dayjs(candidateInterviews[index].schedule).format(
                    'HH:mm:ss DD-MM-YYYY',
                  ),
                  address,
                  interviewer: candidateInterviews[index].interviewer,
                },
              },
            );
          }

          //send notification to admin
          const notificationAdminPayload: NotificationPayload = {
            title: `Nhắc hẹn phỏng vấn: ${time} - Ứng viên ${candidate.user.full_name} tại công ty ${recruitmentRequirement.enterprise.name}`,
            content: `Nhắc hẹn phỏng vấn: ${time} - Ứng viên ${
              candidate.user.full_name
            }, vị trí ${
              recruitmentRequirement.professional_field_input
                ? recruitmentRequirement.professional_field_input
                : ''
            } tại công ty ${recruitmentRequirement.enterprise.name}`,
            type: NOTIFICATION_TYPE.REMIND_INTERVIEW,
            data: {
              recruitment_id: recruitmentRequirement.id,
              candidate_recruitment_id: candidateRecruitment.id,
            },
          };
          const admins = await this.userRepository.findAll({
            where: {
              role_id: ROLE.ADMIN,
            },
          });
          await this.notificationService.createAndSendNotificationForUsers(
            notificationAdminPayload,
            {
              role_id: [ROLE.ADMIN],
            },
          );
          if (admins && admins.length > 0) {
            for (let i = 0; i < admins.length; i++) {
              if (admins[i]?.email) {
                await this.mailService.sendRemindInterviewCandidateRecruitmentToAdmin(
                  {
                    receiver_email: admins[i].email,
                    subject: `[Alehub] Nhắc hẹn phỏng vấn ứng viên`,
                    text: {
                      logo_url: configService.getEnv('LOGO_URL'),
                      recruitment_code: recruitmentRequirement.code,
                      recruitment_id: recruitmentRequirement.id,
                      candidate_name: candidate.user.full_name,
                      webLoginEnterprise:
                        configService.getEnv('WEB_ENTERPRISE'),
                      enterprise_name: recruitmentRequirement.enterprise.name,
                      position: recruitmentRequirement.professional_field_input,
                      time: dayjs(candidateInterviews[index].schedule).format(
                        'HH:mm:ss DD-MM-YYYY',
                      ),
                      address,
                      interviewer: candidateInterviews[index].interviewer,
                    },
                  },
                );
              }
            }
          }

          //send notification to candidate
          if (candidate?.user?.email) {
            await this.mailService.sendRemindInterviewCandidateRecruitmentToCandidate(
              {
                receiver_email: candidate.user.email,
                subject: `[Alehub] Nhắc hẹn lịch phỏng vấn`,
                text: {
                  logo_url: configService.getEnv('LOGO_URL'),
                  recruitment_code: recruitmentRequirement.code,
                  recruitment_id: recruitmentRequirement.id,
                  candidate_name: candidate.user.full_name,
                  webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
                  enterprise_name: recruitmentRequirement.enterprise.name,
                  position: recruitmentRequirement.professional_field_input,
                  time: dayjs(candidateInterviews[index].schedule).format(
                    'HH:mm:ss',
                  ),
                  date: dayjs(candidateInterviews[index].schedule).format(
                    'DD-MM-YYYY',
                  ),
                  address,
                  interviewer: candidateInterviews[index].interviewer,
                },
              },
            );
          }

          // send notification to responsible sale
          if (recruitmentRequirement.responsible_sale_id) {
            const foundUser = await this.userRepository.findByPk(
              recruitmentRequirement.responsible_sale_id,
            );
            if (!foundUser) {
              throw new HttpException(
                'Sale phụ trách không tồn tại trong hệ thống',
                HttpStatus.NOT_FOUND,
              );
            }
            await this.notificationService.createAndSendNotificationForUsers(
              notificationAdminPayload,
              {
                include_user_ids: [recruitmentRequirement.responsible_sale_id],
              },
            );

            if (foundUser?.email) {
              await this.mailService.sendRemindInterviewCandidateRecruitmentToAdmin(
                {
                  receiver_email: foundUser.email,
                  subject: `[Alehub] Nhắc hẹn lịch phỏng vấn`,
                  text: {
                    logo_url: configService.getEnv('LOGO_URL'),
                    recruitment_code: recruitmentRequirement.code,
                    recruitment_id: recruitmentRequirement.id,
                    candidate_name: candidate.user.full_name,
                    webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
                    enterprise_name: recruitmentRequirement.enterprise.name,
                    position: recruitmentRequirement.professional_field_input,
                    time: dayjs(candidateInterviews[index].schedule).format(
                      'HH:mm:ss DD-MM-YYYY',
                    ),
                    address,
                    interviewer: candidateInterviews[index].interviewer,
                  },
                },
              );
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
}
