//Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
//Other dependencies
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
//Local files
import { NotificationRepository } from '@repositories/notification.repository';
import { IS_READ } from '@utils/constants';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { FilterNotificationDto } from '../dto/filter-notification.dto';

@Injectable()
export class DfNotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(user_id: number, dto: FilterNotificationDto) {
    const options: any = {
      where: { user_id },
      order: [['id', 'DESC']],
    };
    const count = await this.notificationRepository.count(options);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    if (dto.page || dto.limit) {
      (options.offset = offset), (options.limit = page_size);
    }

    const notifications = await this.notificationRepository.findAll(options);
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({ data: notifications, paging });
  }

  async readNotification(id: number) {
    const notification = await this.notificationRepository.findByPk(id);
    if (!notification) {
      throw new HttpException('Thông báo không tồn tại', HttpStatus.NOT_FOUND);
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await notification.update({ is_read: IS_READ.READ }, { transaction });
        return notification;
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể chuyển trạng thái thông báo lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    await notification.reload();
    return sendSuccess({ data: notification });
  }

  async readAllNotification(user_id: number) {
    console.log('user_id', user_id);

    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await this.notificationRepository.update(
          { is_read: IS_READ.READ },
          {
            where: {
              user_id,
            },
            transaction,
          },
        );
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể chuyển trạng thái thông báo lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    return sendSuccess({});
  }
}
