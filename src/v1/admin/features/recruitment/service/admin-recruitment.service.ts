// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
//Local files
import { Enterprise } from '@models/enterprise.model';
import { User } from '@models/user.model';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { RecruitmentRequestFileRepository } from '@repositories/recruitment-request-file.repository';
import { NotificationService } from '@services/notification.service';
import {
  NOTIFICATION_TYPE,
  NotificationPayload,
  RECRUITMENT_STATUS,
} from '@utils/constants';
import { convertDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { AdminUpdateStatusRecruitmentDto } from '../dto/admin-change-status.dto';
import { AdminFilterRecruitmentDto } from '../dto/filter-recruitment.dto';

@Injectable()
export class AdminRecruitmentService {
  constructor(
    private readonly recruitmentRequestFileRepository: RecruitmentRequestFileRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly sequelize: Sequelize,
    private readonly notificationService: NotificationService,
  ) {}
  async findAll(dto: AdminFilterRecruitmentDto) {
    let whereCondition: any = {};
    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }
    if (dto.status) {
      whereCondition.status = dto.status;
    }
    if (dto.search) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { '$enterprise.name$': { [Op.like]: `%${dto.search}%` } },
          { '$enterprise.salesperson$': { [Op.like]: `%${dto.search}%` } },
          { '$enterprise.user.full_name$': { [Op.like]: `%${dto.search}%` } },
          { '$enterprise.user.email$': { [Op.like]: `%${dto.search}%` } },
          {
            '$enterprise.user.phone_number$': { [Op.like]: `%${dto.search}%` },
          },
        ],
      };
    }
    const options: any = {
      where: whereCondition,
      include: [
        {
          model: Enterprise,
          include: {
            model: User,
            as: 'user',
          },
        },
      ],
      order: [['id', 'DESC']],
    };
    const count = await this.recruitmentRequestFileRepository.count(options);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    if (dto.page || dto.limit) {
      (options.offset = offset), (options.limit = page_size);
    }

    const recruitment = await this.recruitmentRequestFileRepository.findAll(
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
    const recruitment = await this.recruitmentRequestFileRepository.findOne({
      where: { id },
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
    });

    if (!recruitment) {
      throw new HttpException(
        'Yêu cầu tuyển dụng nhân sự không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }
    return sendSuccess({
      data: recruitment,
      blocks: {
        status: RECRUITMENT_STATUS,
      },
    });
  }

  async changeStatus(dto: AdminUpdateStatusRecruitmentDto) {
    for (let i = 0; i < dto.ids.length; i++) {
      try {
        const recruitment = await this.recruitmentRequestFileRepository.findOne(
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
}
