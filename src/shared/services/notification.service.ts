import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '@repositories/notification.repository';
import { UserRepository } from '@repositories/user.repository';
import { IS_PUSH, IS_READ, NotificationPayload } from '@utils/constants';
import { Op } from 'sequelize';
import { withUserChannel } from '../gateway/constants';
import { MyGateway } from '../gateway/gateway';

@Injectable()
export class NotificationService {
  constructor(
    private readonly myGateway: MyGateway,
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async createAndSendNotificationForUsers(
    requestPayload: NotificationPayload,
    target: {
      include_user_ids?: Array<number>;
      role_id?: Array<number>;
      exclude_user_ids?: Array<number>;
    },
  ): Promise<void> {
    const title = requestPayload.title;

    const payload = {
      title,
      content: requestPayload.content,
      data: requestPayload.data,
      df_notification_id: requestPayload.type,
    };

    const whereOptions: any = {};

    if (target.role_id) {
      whereOptions.role_id = {
        [Op.in]: target.role_id,
      };
    }

    if (target.include_user_ids) {
      whereOptions.id = {
        [Op.in]: target.include_user_ids,
      };
    }
    if (target.exclude_user_ids) {
      whereOptions.id = {
        [Op.notIn]: target.exclude_user_ids,
      };
    }

    const options: any = {
      where: whereOptions,
    };

    const allUsers = await this.userRepository.findAll(options);
    if (allUsers && allUsers.length > 0) {
      const notifyContents = allUsers.map((a) => ({
        user_id: a.id,
        title: payload.title,
        content: payload.content,
        data: payload.data,
        is_push: IS_PUSH.PUSH,
        is_read: IS_READ.NOT_READ,
        type: payload.df_notification_id,
      }));
      if (notifyContents && notifyContents.length > 0) {
        notifyContents.forEach((element) => {
          this.myGateway.emitEvent(
            {
              title: payload.title,
              content: payload.content,
              data: payload.data,
              is_push: 1,
              type: payload.df_notification_id,
            },
            withUserChannel(element.user_id),
          );
        });
        await this.notificationRepository.bulkCreate(notifyContents);
      }
    }
  }

  public async sendNotificationForUsers(
    requestPayload: NotificationPayload,
    target: {
      include_user_ids?: Array<number>;
      role_id?: Array<number>;
      exclude_user_ids?: Array<number>;
    },
  ): Promise<void> {
    const payload = {
      title: requestPayload.title,
      content: requestPayload.content,
      data: requestPayload.data,
      df_tracking_id: requestPayload.type,
    };

    const whereOptions: any = {};

    if (target.role_id) {
      whereOptions.role_id = {
        [Op.in]: target.role_id,
      };
    }

    if (target.include_user_ids) {
      whereOptions.id = {
        [Op.in]: target.include_user_ids,
      };
    }
    if (target.exclude_user_ids) {
      whereOptions.id = {
        [Op.notIn]: target.exclude_user_ids,
      };
    }

    const options: any = {
      where: whereOptions,
    };

    const allUsers = await this.userRepository.findAll(options);
    if (allUsers && allUsers.length > 0) {
      const notifyContents = allUsers.map((a) => ({
        user_id: a.id,
        title: payload.title,
        content: payload.content,
        data: payload.data,
        is_push: IS_PUSH.PUSH,
        is_read: IS_READ.NOT_READ,
        type: payload.df_tracking_id,
      }));
      notifyContents.forEach((element) => {
        this.myGateway.emitEvent(
          {
            title: payload.title,
            content: payload.content,
            data: payload.data,
            is_push: 1,
            type: payload.df_tracking_id,
          },
          withUserChannel(element.user_id),
        );
      });
    }
  }
}
