// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Sequelize } from 'sequelize-typescript';
// Local files
import { BankAccount } from '@models/bank-account.model';
import { User } from '@models/user.model';
import { BankAccountRepository } from '@repositories/bank-account.repository';
import { HroRequestRepository } from '@repositories/hro-request.repository';
import { UserRepository } from '@repositories/user.repository';
import { configService } from '@services/config.service';
import { MailService } from '@services/mail.service';
import { REGISTER_STATUS, USER_STATUS } from '@utils/constants';
import { convertDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { Op } from 'sequelize';
import { AdminUpdateHROUserDto } from '../dto/admin-update-user.dto';
import { FilterAdminHRODto } from '../dto/filter-admin-admin.dto';

@Injectable()
export class AdminHROService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly sequelize: Sequelize,
    private readonly mailService: MailService,
    private readonly hroRequestRepository: HroRequestRepository,
  ) {}

  async findAll(dto: FilterAdminHRODto) {
    const whereCondition: any = {};
    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }
    if (dto.status) {
      whereCondition.status = dto.status;
    }
    const options: any = {
      where: whereCondition,
      include: {
        model: User,
        where: {
          ...(dto.search
            ? {
                [Op.or]: [
                  { full_name: { [Op.like]: `%${dto.search}%` } },
                  {
                    phone_number: { [Op.like]: `%${dto.search}%` },
                  },
                ],
              }
            : {}),
        },
      },
      order: ['status', ['id', 'DESC']],
    };

    const count = await this.hroRequestRepository.count(options);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const users = await this.hroRequestRepository.findAll(options);
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({ data: users, paging });
  }

  async changeStatus(dto: AdminUpdateHROUserDto) {
    for (let index = 0; index < dto.ids.length; index++) {
      const foundRequest = await this.hroRequestRepository.findOne({
        where: {
          id: dto.ids[index],
        },
      });
      if (foundRequest) {
        const foundUser = await this.userRepository.findOne({
          where: {
            id: foundRequest.user_id,
          },
        });
        if (!foundUser) {
          throw new HttpException(
            'Không tìm thấy tài khoản HRO',
            HttpStatus.NOT_FOUND,
          );
        }
        await foundRequest.update({ status: dto.status });
        if (dto.status == REGISTER_STATUS.APPROVE) {
          await foundUser.update({ status: USER_STATUS.ACTIVE });
          if (foundUser?.email) {
            await this.mailService.adminApproveHROToHRO({
              receiver_email: foundUser.email,
              subject: `[Alehub] Thông báo kết quả đăng ký cộng tác viên`,
              text: {
                logo_url: configService.getEnv('LOGO_URL'),
                webLoginAdmin: configService.getEnv('WEB_ADMIN'),
              },
            });
          }
        } else {
          if (foundUser?.email) {
            await this.mailService.adminRejectHROToHRO({
              receiver_email: foundUser.email,
              subject: `[Alehub] Thông báo kết quả đăng ký cộng tác viên`,
              text: {
                logo_url: configService.getEnv('LOGO_URL'),
              },
            });
          }
        }
      }
    }
    return sendSuccess();
  }

  async detail(id: number) {
    const hro = await this.hroRequestRepository.findOne({
      where: {
        id,
      },
      include: {
        model: User,
        include: [
          {
            model: BankAccount,
            attributes: {
              include: [
                [
                  this.sequelize.literal(
                    `(
                  SELECT name FROM df_bank
                  WHERE id = \`user->bank_account\`.\`bank_id\`
                  LIMIT 1
                 )`,
                  ),
                  'bank_name',
                ],
              ],
            },
          },
        ],
      },
    });
    if (!hro) {
      throw new HttpException('Không tìm thấy tài khoản', HttpStatus.NOT_FOUND);
    }
    return sendSuccess({ data: hro });
  }

  async delete(id: number) {
    const hro = await this.hroRequestRepository.findOne({
      where: {
        id,
      },
    });
    if (!hro) {
      throw new HttpException(
        'Không tìm thấy yêu cầu đăng ký hro',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.hroRequestRepository.destroy({
      where: { id },
    });
    return sendSuccess({ msg: 'Xóa thành công' });
  }
}
