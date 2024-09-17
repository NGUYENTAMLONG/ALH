// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// Local files
import { BankAccount } from '@models/bank-account.model';
import { Enterprise } from '@models/enterprise.model';
import { UserPoint } from '@models/user-point.model';
import { User } from '@models/user.model';
import { Wallet } from '@models/wallet.model';
import { BankAccountRepository } from '@repositories/bank-account.repository';
import { HroRequestRepository } from '@repositories/hro-request.repository';
import { RecruitmentRequirementHroRepository } from '@repositories/recruitment-requirement-hro.repository';
import { RecruitmentRequirementImplementationRepository } from '@repositories/recruitment-requirement-implementation.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { UserPointHistoryRepository } from '@repositories/user-point-history.repository';
import { UserPointRepository } from '@repositories/user-point.repository';
import { UserRepository } from '@repositories/user.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { configService } from '@services/config.service';
import { MailService } from '@services/mail.service';
import {
  CANDIDATE_RECRUITMENT_STATUS,
  GENDER,
  IS_ACTIVE,
  REGISTER_STATUS,
  ROLE,
  USER_STATUS,
  WALLET_MUTABLE_TYPE,
  WALLET_TYPE,
} from '@utils/constants';
import { convertDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { Op } from 'sequelize';
import { AdminCreateUserDto } from '../dto/admin-create-user.dto';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto';
import { FilterAdminAdminDto } from '../dto/filter-admin-admin.dto';
import { AdminFilterDetailUserDto } from '../dto/filter-detail-user.dto';
import { RecruitmentRequirement } from '@models/recruitment-requirement.model';

@Injectable()
export class AdminAdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly sequelize: Sequelize,
    private readonly mailService: MailService,
    private readonly walletRepository: WalletRepository,
    private readonly walletHistoryRepository: WalletHistoryRepository,
    private readonly userPointRepository: UserPointRepository,
    private readonly userPointHistoryRepository: UserPointHistoryRepository,
    private readonly recruitmentRequirementHroRepository: RecruitmentRequirementHroRepository,
    private readonly recruitmentRequirementRepository: RecruitmentRequirementRepository,
    private readonly recruitmentRequirementImplementationRepository: RecruitmentRequirementImplementationRepository,
    private readonly hroRequestRepository: HroRequestRepository,
  ) {}

  async create(user_id: number, dto: AdminCreateUserDto) {
    const foundPhoneNumber = await this.userRepository.foundPhoneNumber(
      dto.phone_number,
    );

    if (foundPhoneNumber) {
      throw new HttpException(
        'Số điện thoại đã tồn tại trên hệ thống',
        HttpStatus.FOUND,
      );
    }
    const foundPhoneNumberHROPending = await this.hroRequestRepository.findOne({
      where: {
        status: REGISTER_STATUS.PENDING,
      },
      include: {
        model: User,
        where: { phone_number: dto.phone_number },
      },
    });
    if (foundPhoneNumberHROPending) {
      throw new HttpException(
        'Số điện thoại đã tồn tại trên hệ thống',
        HttpStatus.FOUND,
      );
    }
    if (dto.email) {
      const foundEmail = await this.userRepository.foundEmail(dto.email);
      if (foundEmail) {
        throw new HttpException(
          'Email đã tồn tại trên hệ thống',
          HttpStatus.FOUND,
        );
      }
      const foundEmailHROPending = await this.hroRequestRepository.findOne({
        where: {
          status: REGISTER_STATUS.PENDING,
        },
        include: {
          model: User,
          where: { email: dto.email },
        },
      });
      if (foundEmailHROPending) {
        throw new HttpException(
          'Email đã tồn tại trên hệ thống',
          HttpStatus.FOUND,
        );
      }
    }

    //Check tạo tài khoản HRO gán với doanh nghiệp
    if (dto.enterprise_id) {
      if (dto.role_id !== ROLE.HRO) {
        throw new HttpException(
          'Chỉ có thể gán doanh nghiệp cho tài khoản HR',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const foundEnterprise = await Enterprise.findOne({
        where: {
          id: dto.enterprise_id,
        },
      });

      if (!foundEnterprise) {
        throw new HttpException(
          'Doanh nghiệp không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    const user = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        try {
          const user: User | undefined = await this.userRepository.create(
            {
              gender_id: dto.gender_id ? dto.gender_id : GENDER.NO_UPDATE,
              role_id: dto.role_id,
              password: dto.password,
              full_name: dto.full_name,
              phone_number: dto.phone_number,
              email: dto.email ? dto.email : null,
              date_of_birth: dto.date_of_birth ? dto.date_of_birth : null,
              avatar: dto.avatar,
              alternate_phone: dto.alternate_phone,
              created_by: user_id,
              enterprise_id: dto?.enterprise_id || null,
            },
            { transaction },
          );
          if (dto.bank_id) {
            await this.bankAccountRepository.create(
              {
                user_id: user?.id,
                bank_id: dto.bank_id,
                account_number: dto.account_number,
                cardholder_name: dto.cardholder_name,
              },
              { transaction },
            );
          }
          if (dto.role_id == ROLE.HRO) {
            const wallet = await this.walletRepository.create(
              {
                user_id: user?.id,
                balance: 0,
              },
              { transaction },
            );
            await this.walletHistoryRepository.create(
              {
                wallet_id: wallet?.id,
                type: WALLET_TYPE.ADD,
                mutable_type: WALLET_MUTABLE_TYPE.ADD_UPDATE,
                value: 0,
                current_balance: 0,
                created_by: user_id,
              },
              { transaction },
            );
            const userPoint = await this.userPointRepository.create(
              {
                user_id: user?.id,
                point: 0,
              },
              { transaction },
            );
            await this.userPointHistoryRepository.create(
              {
                user_point_id: userPoint?.id,
                type: WALLET_TYPE.ADD,
                mutable_type: WALLET_MUTABLE_TYPE.ADD_UPDATE,
                value: 0,
                current_point: 0,
                created_by: user_id,
              },
              { transaction },
            );
          }
          return user;
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể cập nhật tài khoản lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );
    if (dto.role_id == ROLE.HRO && dto?.email) {
      await this.mailService.adminCreateHROToHRO({
        receiver_email: dto.email,
        subject: `[Alehub] Thông báo tạo tài khoản thành công `,
        text: {
          logo_url: configService.getEnv('LOGO_URL'),
          webLoginAdmin: configService.getEnv('WEB_ADMIN'),
          hro_full_name: user?.full_name,
          email: user?.email,
          phone_number: user?.phone_number,
          password: dto.password,
        },
      });
    }

    return sendSuccess({ data: user });
  }

  async findAll(user_id: number, dto: FilterAdminAdminDto) {
    const whereCondition: any = {
      role_id: {
        [Op.in]: [
          ROLE.ADMIN,
          ROLE.IMPLEMENTATION_SALE,
          ROLE.RESPONSIBLE_SALE,
          ROLE.HRO,
        ],
      },
      status: { [Op.in]: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE] },
      [Op.and]: [],
    };
    const foundUser = await this.userRepository.findByPk(user_id);
    if (!foundUser) {
      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    if (foundUser.role_id == ROLE.ADMIN) {
      whereCondition.id = { [Op.ne]: user_id };
    }
    if (
      foundUser.role_id == ROLE.RESPONSIBLE_SALE ||
      foundUser.role_id == ROLE.IMPLEMENTATION_SALE
    ) {
      whereCondition.role_id = ROLE.HRO;
    }
    if (dto.search) {
      whereCondition[Op.and].push({
        [Op.or]: [
          { full_name: { [Op.like]: `%${dto.search}%` } },
          {
            phone_number: { [Op.like]: `%${dto.search}%` },
          },
        ],
      });
    }
    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }
    if (dto.role_id) {
      whereCondition.role_id = dto.role_id;
    }
    if (dto.status) {
      whereCondition.status = dto.status;
    }
    const options: any = {
      where: whereCondition,
      order: [['id', 'DESC']],
    };

    const count = await this.userRepository.count(options);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const users = await this.userRepository.findAll(options);
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    const blocks = {
      role_id: [
        { id: 1, name: 'Admin' },
        { id: 4, name: 'Sale triển khai' },
        { id: 5, name: 'Sale phụ trách' },
        { id: 6, name: 'HRO' },
      ],
    };
    return sendSuccess({ data: users, paging, blocks });
  }

  async update(id: number, dto: AdminUpdateUserDto, user_id: number) {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new HttpException('Không tìm thấy tài khoản', HttpStatus.NOT_FOUND);
    }

    const foundPhoneNumber = await this.userRepository.findOne({
      where: {
        phone_number: dto.phone_number,
        status: { [Op.in]: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE] },
        id: { [Op.ne]: user.id },
        role_id: {
          [Op.in]: [user.role_id],
        },
      },
    });

    if (foundPhoneNumber) {
      throw new HttpException(
        'Số điện thoại đã tồn tại trên hệ thống',
        HttpStatus.FOUND,
      );
    }

    const foundEmail = await this.userRepository.findOne({
      where: {
        email: dto.email,
        status: { [Op.in]: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE] },
        id: { [Op.ne]: user.id },
      },
    });

    if (foundEmail) {
      throw new HttpException(
        'Email đã tồn tại trên hệ thống',
        HttpStatus.FOUND,
      );
    }
    const tokenUpdate = user.token;

    //Check tạo tài khoản HRO gán với doanh nghiệp
    if (dto.enterprise_id) {
      if (dto.role_id !== ROLE.HRO) {
        throw new HttpException(
          'Chỉ có thể gán doanh nghiệp cho tài khoản HR',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const foundEnterprise = await Enterprise.findOne({
        where: {
          id: dto.enterprise_id,
        },
      });

      if (!foundEnterprise) {
        throw new HttpException(
          'Doanh nghiệp không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await user.update(
          {
            gender_id: dto.gender_id ? dto.gender_id : GENDER.NO_UPDATE,
            role_id: dto.role_id,
            password: dto.password || user.password,
            full_name: dto.full_name,
            phone_number: dto.phone_number,
            email: dto.email ? dto.email : null,
            date_of_birth: dto.date_of_birth ? dto.date_of_birth : null,
            avatar: dto.avatar,
            alternate_phone: dto.alternate_phone,
            status: dto.status,
            token: dto.status == IS_ACTIVE.INACTIVE ? null : tokenUpdate,
            enterprise_id: dto?.enterprise_id || null,
          },
          { transaction },
        );
        if (dto.bank_id) {
          const foundBankAccount = await this.bankAccountRepository.findOne({
            where: { user_id: id },
          });
          if (foundBankAccount) {
            await foundBankAccount.update(
              {
                bank_id: dto.bank_id,
                account_number: dto.account_number,
                cardholder_name: dto.cardholder_name,
              },
              { transaction },
            );
          } else {
            await this.bankAccountRepository.create(
              {
                user_id: user?.id,
                bank_id: dto.bank_id,
                account_number: dto.account_number,
                cardholder_name: dto.cardholder_name,
              },
              { transaction },
            );
          }
        }
        if (dto.role_id == ROLE.HRO && user.role_id != ROLE.HRO) {
          const wallet = await this.walletRepository.create(
            {
              user_id: user?.id,
              balance: 0,
            },
            { transaction },
          );
          await this.walletHistoryRepository.create(
            {
              wallet_id: wallet?.id,
              type: WALLET_TYPE.ADD,
              mutable_type: WALLET_MUTABLE_TYPE.ADD_UPDATE,
              value: 0,
              current_balance: 0,
              created_by: user_id,
            },
            { transaction },
          );
          const userPoint = await this.userPointRepository.create(
            {
              user_id: user?.id,
              point: 0,
            },
            { transaction },
          );
          await this.userPointHistoryRepository.create(
            {
              user_point_id: userPoint?.id,
              type: WALLET_TYPE.ADD,
              mutable_type: WALLET_MUTABLE_TYPE.ADD_UPDATE,
              value: 0,
              current_point: 0,
              created_by: user_id,
            },
            { transaction },
          );
        }
        return user;
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể cập nhật tài khoản lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    await user.reload();
    return sendSuccess({ data: user });
  }

  async resetPassword(id: number) {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new HttpException('Không tìm thấy tài khoản', HttpStatus.NOT_FOUND);
    }

    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await user.update(
          {
            password: '123456',
          },
          { transaction },
        );
        return user;
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể reset password vào lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    await user.reload();
    return sendSuccess({ data: user, msg: 'Đặt lại mật khẩu thành công' });
  }

  async detail(id: number, dto: AdminFilterDetailUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        role_id: {
          [Op.in]: [
            ROLE.ADMIN,
            ROLE.IMPLEMENTATION_SALE,
            ROLE.RESPONSIBLE_SALE,
            ROLE.HRO,
          ],
        },
        id,
      },
      include: [
        {
          model: BankAccount,
          attributes: {
            include: [
              [
                this.sequelize.literal(
                  `(
                SELECT name FROM df_bank
                WHERE id = bank_account.bank_id
                LIMIT 1
               )`,
                ),
                'bank_name',
              ],
            ],
          },
        },
        {
          model: Wallet,
        },
        {
          model: UserPoint,
        },
        {
          model: Enterprise,
          as: 'work_for_enterprise',
        },
      ],
    });
    if (!user) {
      throw new HttpException('Không tìm thấy tài khoản', HttpStatus.NOT_FOUND);
    }
    const recruitmentHro: any = {};
    if (user.role_id == ROLE.HRO) {
      const whereCondition: any = { [Op.and]: [] };
      const foundRecruitmentRequirementHro =
        await this.recruitmentRequirementHroRepository.findAll({
          where: {
            user_id: user.id,
          },
        });
      let listID: number[] = [];
      if (
        foundRecruitmentRequirementHro &&
        foundRecruitmentRequirementHro.length > 0
      ) {
        listID = foundRecruitmentRequirementHro.map(
          (e) => e.recruitment_requirement_id,
        );
      }
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            id: {
              [Op.in]: listID,
            },
          },
          {
            is_all_hro: IS_ACTIVE.ACTIVE,
          },
        ],
      });

      const options: any = {
        where: whereCondition,
        attributes: {
          include: [
            [
              this.sequelize.literal(
                `(
            SELECT COUNT( DISTINCT candidate_information_id) FROM candidate_recruitment
            JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
            WHERE recruitment_requirement_id = RecruitmentRequirement.id
            AND candidate_recruitment.deleted_at IS NULL
            AND candidate_information.created_by = ${user.id}
            LIMIT 1
           )`,
              ),
              'candidate_count',
            ],
            [
              this.sequelize.literal(
                `(
            SELECT COUNT( DISTINCT candidate_information_id) FROM candidate_recruitment
            JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
            WHERE recruitment_requirement_id = RecruitmentRequirement.id
            AND candidate_recruitment.deleted_at IS NULL
            AND candidate_information.created_by = ${user.id}
            AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.APPROVE_CV}
           )`,
              ),
              'candidate_approve_cv',
            ],
            [
              this.sequelize.literal(
                `(
            SELECT COUNT( DISTINCT candidate_information_id) FROM candidate_recruitment
            JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
            WHERE recruitment_requirement_id = RecruitmentRequirement.id
            AND candidate_recruitment.deleted_at IS NULL
            AND candidate_information.created_by = ${user.id}
            AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.REJECT_CV}
           )`,
              ),
              'candidate_reject_cv',
            ],
            [
              this.sequelize.literal(
                `(
            SELECT COUNT( DISTINCT candidate_information_id) FROM candidate_recruitment
            JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
            WHERE recruitment_requirement_id = RecruitmentRequirement.id
            AND candidate_recruitment.deleted_at IS NULL
            AND candidate_information.created_by = ${user.id}
            AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.GET_A_JOB}
           )`,
              ),
              'candidate_get_job',
            ],
            [
              this.sequelize.literal(
                `(
            SELECT COUNT( DISTINCT candidate_information_id) FROM candidate_recruitment
            JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
            WHERE recruitment_requirement_id = RecruitmentRequirement.id
            AND candidate_recruitment.deleted_at IS NULL
            AND candidate_information.created_by = ${user.id}
            AND candidate_recruitment.status = ${CANDIDATE_RECRUITMENT_STATUS.DO_NOT_GET_A_JOB}
           )`,
              ),
              'candidate_do_not_get_job',
            ],
          ],
        },
        include: [
          {
            model: Enterprise,
            include: {
              model: User,
              as: 'user',
            },
          },
        ],
        order: ['status', ['updated_at', 'DESC']],
      };
      const countOptions = {
        where: whereCondition,
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
      };
      const count = await this.recruitmentRequirementRepository.count(
        countOptions,
      );

      const { current_page, page_size, total_count, offset } = paginateData(
        count,
        dto.page,
        dto.limit,
      );

      options.offset = offset;
      options.limit = page_size;

      const recruitment = await this.recruitmentRequirementRepository.findAll(
        options,
      );
      const paging = {
        total_count,
        current_page,
        limit: page_size,
        offset,
      };
      recruitmentHro.recruitment = recruitment;
      recruitmentHro.paging = paging;
    }
    return sendSuccess({ data: { user, recruitment_hro: recruitmentHro } });
  }

  async delete(id: number) {
    const user = await this.userRepository.findByPk(id);
    // return user;
    if (!user) {
      throw new HttpException('Không tìm thấy tài khoản', HttpStatus.NOT_FOUND);
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      // await user.update(
      //   { status: USER_STATUS.WAITING, token: null },
      //   { transaction },
      // );
      await User.update(
        { deleted_at: new Date(), token: null },
        {
          where: {
            id,
          },
          transaction,
        },
      );

      await this.recruitmentRequirementHroRepository.destroy({
        where: {
          user_id: id,
        },
        transaction,
      });
      await this.recruitmentRequirementImplementationRepository.destroy({
        where: {
          user_id: id,
        },
        transaction,
      });
      await this.recruitmentRequirementRepository.update(
        {
          responsible_sale_id: null,
        },
        {
          where: { responsible_sale_id: id },
          transaction,
        },
      );

      if (user.role_id === ROLE.HRO) {
        //Xoá các tin tuyển dụng đã đăng
        await RecruitmentRequirement.update(
          {
            deleted_at: new Date(),
          },
          {
            where: {
              created_by: user.id,
            },
            transaction,
          },
        );

        //Xoá ví và điểm
        await Wallet.update(
          {
            deleted_at: new Date(),
          },
          {
            where: {
              user_id: user.id,
            },
            transaction,
          },
        );

        await UserPoint.update(
          {
            deleted_at: new Date(),
          },
          {
            where: {
              user_id: user.id,
            },
            transaction,
          },
        );
      }
    });

    return sendSuccess({ msg: 'Xóa tài khoản thành công' });
  }
}
