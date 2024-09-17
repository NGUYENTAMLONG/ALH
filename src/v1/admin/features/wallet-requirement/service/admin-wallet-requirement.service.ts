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
  WALLET_REQUIREMENT_STATUS,
} from '@utils/constants';
import { convertDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { AdminFilterRecruitmentDto } from '../dto/filter-wallet-requirement.dto';
import { AdminUpdateStatusWalletRequirementDto } from '../dto/wallet-requiment.dto';
import { WalletRequirementRepository } from '@repositories/wallet-requirement.repository';
import { DFBank } from '@models/df-bank.model';
import { Wallet } from '@models/wallet.model';

@Injectable()
export class AdminWalletRequirementService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly notificationService: NotificationService,
    private readonly walletRequirementRepository: WalletRequirementRepository,
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
          { '$user.full_name$': { [Op.like]: `%${dto.search}%` } },
          {
            '$user.phone_number$': { [Op.like]: `%${dto.search}%` },
          },
        ],
      };
    }
    const options: any = {
      where: whereCondition,
      include: [
        {
          model: User,
        },
        {
          model: DFBank,
        },
        {
          model: Wallet,
        },
      ],
      order: [['id', 'DESC']],
    };
    const count = await this.walletRequirementRepository.count(options);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    if (dto.page || dto.limit) {
      (options.offset = offset), (options.limit = page_size);
    }

    const walletRequirement = await this.walletRequirementRepository.findAll(
      options,
    );
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({
      data: walletRequirement,
      blocks: {
        status: WALLET_REQUIREMENT_STATUS,
      },
      paging,
    });
  }

  async detail(id: number) {
    const walletRequirement = await this.walletRequirementRepository.findOne({
      where: { id },
      include: [
        {
          model: User,
        },
        {
          model: DFBank,
        },
        {
          model: Wallet,
        },
      ],
    });

    if (!walletRequirement) {
      throw new HttpException(
        'Yêu cầu rút tiền không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }
    return sendSuccess({
      data: walletRequirement,
      blocks: {
        status: WALLET_REQUIREMENT_STATUS,
      },
    });
  }

  async changeStatus(dto: AdminUpdateStatusWalletRequirementDto) {
    for (let i = 0; i < dto.ids.length; i++) {
      try {
        const walletRequirement =
          await this.walletRequirementRepository.findOne({
            where: {
              id: dto.ids[i],
            },
          });
        if (!walletRequirement) {
          throw new HttpException(
            'Yêu cầu rút tiền không tồn tại',
            HttpStatus.NOT_FOUND,
          );
        }
        if (walletRequirement.status == dto.status) {
          throw new HttpException(
            'Trạng thái thay đổi phải khác với trạng thái hiện tại của yêu cầu rút tiền',
            HttpStatus.AMBIGUOUS,
          );
        }

        await this.sequelize.transaction(async (transaction: Transaction) => {
          try {
            await walletRequirement.update(
              {
                status: dto.status,
              },
              { transaction },
            );
          } catch (error) {
            throw new HttpException(
              'Có lỗi xảy ra không thể cập nhật trạng thái yêu cầu rút tiền vào lúc này',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        });

        // let title = '';
        // let content = '';
        // if (dto.status == RECRUITMENT_STATUS.IN_PROGRESS) {
        //   title = 'Admin xác nhận Đang xử lý yêu cầu tuyển dụng ';
        //   content = `Yêu cầu tuyển dụng ${recruitment.code} Đang được xử lý`;
        // } else if (dto.status == RECRUITMENT_STATUS.PROCESSED) {
        //   title = 'Admin xác nhận Đã xử lý yêu cầu tuyển dụng ';
        //   content = `Yêu cầu tuyển dụng ${recruitment.code} Đã được xử lý`;
        // } else if (dto.status == RECRUITMENT_STATUS.REJECTED) {
        //   title = 'Admin xác nhận Từ chối yêu cầu tuyển dụng ';
        //   content = `Yêu cầu tuyển dụng ${recruitment.code} Đã từ chối yêu cầu tuyển dụng`;
        // }
        // const notificationPayload: NotificationPayload = {
        //   title,
        //   content,
        //   type: NOTIFICATION_TYPE.RECRUITMENT,
        //   data: { recruitment_id: recruitment.id },
        // };
        // this.notificationService.createAndSendNotificationForUsers(
        //   notificationPayload,
        //   {
        //     include_user_ids: [enterprise.user_id],
        //   },
        // );
        await walletRequirement.reload();
      } catch (error) {
        console.log(error);
      }
    }
    return sendSuccess({ msg: 'Thay đổi trạng thái thành công' });
  }

  async resolveAllWalletRequirement() {
    try {
      await this.walletRequirementRepository.update(
        {
          status: WALLET_REQUIREMENT_STATUS.RESOLVED,
        },
        {
          where: {
            status: {
              [Op.notIn]: [
                WALLET_REQUIREMENT_STATUS.RESOLVED,
                WALLET_REQUIREMENT_STATUS.REJECTED,
              ],
            },
          },
        },
      );
      return sendSuccess({
        msg: 'Phê duyệt toàn bộ các yêu cầu rút tiền thành công',
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể phê duyệt toàn bộ các yêu cầu rút tiền vào lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
