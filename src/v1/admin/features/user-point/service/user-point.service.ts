// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import * as dayjs from 'dayjs';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// Local dependencies
import { CandidateInformation } from '@models/candidate-information.model';
import { Enterprise } from '@models/enterprise.model';
import { RecruitmentRequirement } from '@models/recruitment-requirement.model';
import { User } from '@models/user.model';
import { UserPointHistoryRepository } from '@repositories/user-point-history.repository';
import { UserPointRepository } from '@repositories/user-point.repository';
import { UserRepository } from '@repositories/user.repository';
import { configService } from '@services/config.service';
import { MailService } from '@services/mail.service';
import { NotificationService } from '@services/notification.service';
import {
  NOTIFICATION_TYPE,
  NotificationPayload,
  POINT_MUTABLE_TYPE,
  POINT_TYPE,
} from '@utils/constants';
import { convertDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { AdminFilterDetailUserPointDto } from '../dto/filter-detail-user-point.dto';
import { AdminUpdateUserPointDto } from '../dto/update-wallet.dto';

@Injectable()
export class AdminUserPointService {
  constructor(
    private readonly userPointRepository: UserPointRepository,
    private readonly userPointHistoryRepository: UserPointHistoryRepository,
    private readonly userRepository: UserRepository,
    private readonly sequelize: Sequelize,
    private readonly notificationService: NotificationService,
    private readonly mailService: MailService,
  ) {}

  async update(id: number, dto: AdminUpdateUserPointDto, user_id: number) {
    const foundUser = await this.userRepository.findByPk(id);
    if (!foundUser) {
      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống!',
        HttpStatus.NOT_FOUND,
      );
    }
    const userPoint = await this.userPointRepository.findOne({
      where: { user_id: id },
    });
    if (!userPoint) {
      throw new HttpException(
        'Điểm không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    let point = Number(userPoint.point);
    if (dto.type == POINT_MUTABLE_TYPE.ADD_UPDATE) {
      point = point + Number(dto.value);
    } else {
      point = point - Number(dto.value);
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      userPoint.update(
        {
          point,
        },
        { transaction },
      );
      await this.userPointHistoryRepository.create(
        {
          user_point_id: userPoint.id,
          type: dto.type,
          value: dto.value,
          current_point: point,
          mutable_type:
            dto.type == POINT_TYPE.ADD
              ? POINT_MUTABLE_TYPE.ADD_UPDATE
              : POINT_MUTABLE_TYPE.SUB_UPDATE,
          created_by: user_id,
          note: dto.note || null,
        },
        { transaction },
      );
    });
    await userPoint.reload();
    if (dto.type == POINT_TYPE.ADD) {
      const notificationPayload: NotificationPayload = {
        title: `Cộng điểm ${dto.value} từ hệ thống Alehub`,
        content: `Cộng điểm ${dto.value} từ hệ thống Alehub`,
        type: NOTIFICATION_TYPE.POINT,
        data: {
          user_id: id,
          user_point_id: userPoint.id,
        },
      };
      this.notificationService.createAndSendNotificationForUsers(
        notificationPayload,
        {
          include_user_ids: [foundUser.id],
        },
      );

      if (foundUser?.email) {
        this.mailService.updateAddUserPointToHRO({
          receiver_email: foundUser.email,
          subject: '[Alehub] Thông báo cộng điểm',
          text: {
            logo_url: configService.getEnv('LOGO_URL'),
            webLoginAdmin: configService.getEnv('WEB_ADMIN'),
            hro_name: foundUser.full_name,
            value: dto.value,
            point: point,
            time: dayjs().format('HH:mm:ss DD-MM-YYYY'),
            note: dto.note,
            hro_id: foundUser.id,
          },
        });
      }
    } else {
      const notificationPayload: NotificationPayload = {
        title: `Trừ điểm ${dto.value} từ hệ thống Alehub`,
        content: `Trừ điểm ${dto.value} từ hệ thống Alehub`,
        type: NOTIFICATION_TYPE.WALLET,
        data: {
          user_id: id,
          user_point_id: userPoint.id,
        },
      };
      this.notificationService.createAndSendNotificationForUsers(
        notificationPayload,
        {
          include_user_ids: [foundUser.id],
        },
      );
      if (foundUser?.email) {
        this.mailService.updateSubUserPointToHRO({
          receiver_email: foundUser.email,
          subject: `[Alehub] Thông báo trừ điểm`,
          text: {
            logo_url: configService.getEnv('LOGO_URL'),
            webLoginAdmin: configService.getEnv('WEB_ADMIN'),
            hro_name: foundUser.full_name,
            value: dto.value,
            point: point,
            time: dayjs().format('HH:mm:ss DD-MM-YYYY'),
            note: dto.note,
            hro_id: foundUser.id,
          },
        });
      }
    }

    return sendSuccess({
      data: userPoint,
      msg: 'Cập nhật điểm thành công',
    });
  }

  async detail(id: number, dto: AdminFilterDetailUserPointDto) {
    const userPoint = await this.userPointRepository.findOne({
      where: { user_id: id },
      include: { model: User },
    });
    if (!userPoint) {
      throw new HttpException(
        'Điểm không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const whereCondition: any = {
      user_point_id: userPoint.id,
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
        { model: CandidateInformation, include: { model: User } },
      ],
      order: [['id', 'DESC']],
    };
    const count = await this.userPointHistoryRepository.count(options);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const userPointHistory = await this.userPointHistoryRepository.findAll(
      options,
    );
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({
      data: { user_point: userPoint, user_point_history: userPointHistory },
      paging,
    });
  }
}
