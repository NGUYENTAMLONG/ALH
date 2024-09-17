//Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
//Local files
import { CandidateInformation } from '@models/candidate-information.model';
import { Enterprise } from '@models/enterprise.model';
import { RecruitmentRequirement } from '@models/recruitment-requirement.model';
import { User } from '@models/user.model';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { UserRepository } from '@repositories/user.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { configService } from '@services/config.service';
import { MailService } from '@services/mail.service';
import { NotificationService } from '@services/notification.service';
import {
  NOTIFICATION_TYPE,
  NotificationPayload,
  ROLE,
  WALLET_MUTABLE_TYPE,
  WALLET_TYPE,
} from '@utils/constants';
import { convertDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import * as dayjs from 'dayjs';
import { AdminFilterDetailWalletDto } from '../dto/filter-detail-wallet.dto';
import { AdminUpdateWalletDto } from '../dto/update-wallet.dto';

@Injectable()
export class AdminWalletService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly walletHistoryRepository: WalletHistoryRepository,
    private readonly notificationService: NotificationService,
    private readonly mailService: MailService,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly userRepository: UserRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async update(id: number, dto: AdminUpdateWalletDto, user_id: number) {
    const foundUser = await this.userRepository.findByPk(id);
    if (!foundUser) {
      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống!',
        HttpStatus.NOT_FOUND,
      );
    }
    const wallet = await this.walletRepository.findOne({
      where: { user_id: id },
    });
    if (!wallet) {
      throw new HttpException(
        'Ví không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    let balance = Number(wallet.balance);
    if (dto.type == WALLET_TYPE.ADD) {
      balance = balance + Number(dto.value);
    } else {
      balance = balance - Number(dto.value);
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      wallet.update(
        {
          balance,
        },
        { transaction },
      );
      await this.walletHistoryRepository.create(
        {
          wallet_id: wallet?.id,
          type: dto.type,
          value: dto.value,
          current_balance: balance,
          mutable_type:
            dto.type == WALLET_TYPE.ADD
              ? WALLET_MUTABLE_TYPE.ADD_UPDATE
              : WALLET_MUTABLE_TYPE.SUB_UPDATE,
          created_by: user_id,
          note: dto.note || null,
        },
        { transaction },
      );
    });
    await wallet.reload();
    if (foundUser.role_id == ROLE.ENTERPRISE) {
      const foundEnterprise = await this.enterpriseRepository.findOne({
        where: {
          user_id: id,
        },
      });
      if (!foundEnterprise) {
        throw new HttpException(
          'Doanh nghiệp không tồn tại trong hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
      if (dto.type == WALLET_TYPE.ADD) {
        const notificationPayload: NotificationPayload = {
          title: `Nạp thành công số tiền ${dto.value} vào ví doanh nghiệp.`,
          content: `Nạp thành công số tiền ${dto.value} vào ví doanh nghiệp.`,
          type: NOTIFICATION_TYPE.WALLET,
          data: {
            user_id: id,
            wallet_id: wallet.id,
          },
        };
        this.notificationService.createAndSendNotificationForUsers(
          notificationPayload,
          {
            include_user_ids: [foundUser.id],
          },
        );

        if (foundUser?.email) {
          this.mailService.updateAddWalletToEnterprise({
            receiver_email: foundUser.email,
            subject: `[Alehub] Thông báo nạp tiền`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
              enterprise_name: foundEnterprise.name,
              value: dto.value,
              balance: balance,
              time: dayjs().format('HH:mm:ss DD-MM-YYYY'),
              note: dto.note,
            },
          });
        }
      } else {
        const notificationPayload: NotificationPayload = {
          title: `Trừ tiền ${dto.value} từ hệ thống Alehub`,
          content: `Trừ tiền ${dto.value} từ hệ thống Alehub`,
          type: NOTIFICATION_TYPE.WALLET,
          data: {
            enterprise_id: id,
            wallet_id: wallet.id,
          },
        };
        this.notificationService.createAndSendNotificationForUsers(
          notificationPayload,
          {
            include_user_ids: [foundUser.id],
          },
        );

        if (foundUser?.email) {
          this.mailService.updateSubWalletToEnterprise({
            receiver_email: foundUser.email,
            subject: `[Alehub] Thông báo trừ tiền`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
              enterprise_name: foundEnterprise.name,
              value: dto.value,
              balance: balance,
              time: dayjs().format('HH:mm:ss DD-MM-YYYY'),
              note: dto.note,
            },
          });
        }
      }
    } else if (foundUser.role_id == ROLE.HRO) {
      if (dto.type == WALLET_TYPE.ADD) {
        const notificationPayload: NotificationPayload = {
          title: `Nạp thành công số tiền ${dto.value} vào ví cộng tác viên.`,
          content: `Nạp thành công số tiền ${dto.value} vào ví cộng tác viên.`,
          type: NOTIFICATION_TYPE.WALLET,
          data: {
            user_id: id,
            wallet_id: wallet.id,
          },
        };
        this.notificationService.createAndSendNotificationForUsers(
          notificationPayload,
          {
            include_user_ids: [foundUser.id],
          },
        );
        if (foundUser?.email) {
          this.mailService.updateAddWalletToHRO({
            receiver_email: foundUser.email,
            subject: `[Alehub] Thông báo nạp tiền`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              webLoginAdmin: configService.getEnv('WEB_ADMIN'),
              hro_name: foundUser.full_name,
              value: dto.value,
              balance: balance,
              time: dayjs().format('HH:mm:ss DD-MM-YYYY'),
              note: dto.note,
              hro_id: foundUser.id,
            },
          });
        }
      } else {
        const notificationPayload: NotificationPayload = {
          title: `Trừ tiền ${dto.value} từ hệ thống Alehub`,
          content: `Trừ tiền ${dto.value} từ hệ thống Alehub`,
          type: NOTIFICATION_TYPE.WALLET,
          data: {
            user_id: id,
            wallet_id: wallet.id,
          },
        };
        this.notificationService.createAndSendNotificationForUsers(
          notificationPayload,
          {
            include_user_ids: [foundUser.id],
          },
        );

        if (foundUser?.email) {
          this.mailService.updateSubWalletToHRO({
            receiver_email: foundUser.email,
            subject: `[Alehub] Thông báo trừ tiền`,
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              webLoginAdmin: configService.getEnv('WEB_ADMIN'),
              hro_name: foundUser.full_name,
              value: dto.value,
              balance: balance,
              time: dayjs().format('HH:mm:ss DD-MM-YYYY'),
              note: dto.note,
              hro_id: foundUser.id,
            },
          });
        }
      }
    }
    return sendSuccess({
      data: wallet,
      msg: 'Cập nhật ví thành công',
    });
  }

  async detail(id: number, dto: AdminFilterDetailWalletDto) {
    const wallet = await this.walletRepository.findOne({
      where: { user_id: id },
      include: { model: User },
    });
    if (!wallet) {
      throw new HttpException(
        'Ví không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const whereCondition: any = {
      wallet_id: wallet.id,
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
        {
          model: CandidateInformation,
          as: 'candidate_information',
          include: { model: User },
        },
      ],
      order: [['id', 'DESC']],
    };
    const count = await this.walletHistoryRepository.count(options);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const walletHistory = await this.walletHistoryRepository.findAll(options);
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({
      data: { wallet, wallet_history: walletHistory },
      paging,
    });
  }
}
