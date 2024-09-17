// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Op } from 'sequelize';
// Local files
import { AgeGroupRepository } from '@repositories/age-group.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { GenderRepository } from '@repositories/gender.repository';
import { JobTypeRepository } from '@repositories/job-type.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { TrackingLogRepository } from '@repositories/tracking-log.repository';
import { UserRepository } from '@repositories/user.repository';
import { YearOfExperienceRepository } from '@repositories/year-of-experience.repository';
import { configService } from '@services/config.service';
import { MailService } from '@services/mail.service';
import { NotificationService } from '@services/notification.service';
import { NotificationPayload, ROLE, TRACKING_TYPE } from '@utils/constants';
import { sendSuccess } from '@utils/send-success';
import { EnterpriseCreateTrackingDto } from '../dto/create-tracking.dto';

@Injectable()
export class EnterpriseTrackingService {
  constructor(
    private readonly trackingLogRepository: TrackingLogRepository,
    private readonly ageGroup: AgeGroupRepository,
    private readonly dFProvinceRepository: DFProvinceRepository,
    private readonly professionalFieldRepository: ProfessionalFieldRepository,
    private readonly genderRepository: GenderRepository,
    private readonly jobTypeRepository: JobTypeRepository,
    private readonly yearOfExperienceRepository: YearOfExperienceRepository,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async create(user_id: number, dto: EnterpriseCreateTrackingDto) {
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
    const data: any = {};
    if (dto.age_group_ids) {
      const ageGroup = await this.ageGroup.findAll({
        where: {
          id: { [Op.in]: dto.age_group_ids.split(',') },
        },
      });
      data.age_group = ageGroup?.map((e) => ({
        min_age: e.min_age,
        max_age: e.max_age,
      }));
    }
    if (dto.df_province_ids) {
      const province = await this.dFProvinceRepository.findAll({
        where: {
          id: { [Op.in]: dto.df_province_ids.split(',') },
        },
      });
      data.province = province?.map((e) => e.name);
    }
    if (dto.professional_field_ids) {
      const professionalFields = await this.professionalFieldRepository.findAll(
        {
          where: {
            id: { [Op.in]: dto.professional_field_ids.split(',') },
          },
        },
      );
      data.professional_field = professionalFields?.map((e) => e.name);
    }
    if (dto.gender_ids) {
      const gender = await this.genderRepository.findAll({
        where: {
          id: { [Op.in]: dto.gender_ids.split(',') },
        },
      });
      data.gender = gender?.map((e) => e.name);
    }
    if (dto.job_type_ids) {
      const jobTypes = await this.jobTypeRepository.findAll({
        where: {
          id: { [Op.in]: dto.job_type_ids.split(',') },
        },
      });
      data.job_type = jobTypes?.map((e) => e.name);
    }
    if (dto.years_of_experience_ids) {
      const yearOfExperiences = await this.yearOfExperienceRepository.findAll({
        where: {
          id: { [Op.in]: dto.years_of_experience_ids.split(',') },
        },
      });
      data.year_of_experiences = yearOfExperiences?.map((e) => e.description);
    }

    const notificationPayload: NotificationPayload = {
      title: '[Alehub] Tracking',
      content: 'Doanh nghiệp tìm kiếm ứng viên',
      type: TRACKING_TYPE.DETAIL_CANDIDATE,
      data,
    };
    this.notificationService.sendNotificationForUsers(notificationPayload, {
      role_id: [ROLE.ADMIN],
    });
    await this.trackingLogRepository.create({
      user_id,
      data,
      type: TRACKING_TYPE.DETAIL_CANDIDATE,
      candidate_id: dto.candidate_id,
    });
    const admin = await this.userRepository.findOne({
      where: {
        role_id: ROLE.ADMIN,
      },
    });
    if (admin && admin?.email) {
      await this.mailService.sendSearchDetailCandidateToAdmin({
        receiver_email: admin.email,
        subject: '[AleHub] Tracking Log',
        text: {
          enterprise_name: enterprise.name,
          webLoginAdmin: configService.getEnv('WEB_ADMIN'),
          data: JSON.stringify(data),
        },
      });
    }
    return sendSuccess();
  }
}
