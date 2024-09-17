// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Other files
import * as bcrypt from 'bcrypt';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

// Local files
import { ForgotPassword } from '@models/forgot-password.model';
import { UserPoint } from '@models/user-point.model';
import { User } from '@models/user.model';
import { Wallet } from '@models/wallet.model';
import { BankAccountRepository } from '@repositories/bank-account.repository';
import { ForgotPasswordRepository } from '@repositories/forgot-password.repository';
import { HroRequestRepository } from '@repositories/hro-request.repository';
import { UserPointHistoryRepository } from '@repositories/user-point-history.repository';
import { UserPointRepository } from '@repositories/user-point.repository';
import { UserRepository } from '@repositories/user.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { configService } from '@services/config.service';
import { HashService } from '@services/hash.service';
import { MailService } from '@services/mail.service';
import { NotificationService } from '@services/notification.service';
import {
  CANDIDATE_STATUS,
  DEFAULT_PASSWORD,
  GENDER,
  IS_ACTIVE,
  NOTIFICATION_TYPE,
  NotificationPayload,
  REGISTER_STATUS,
  ROLE,
  USER_STATUS,
  WALLET_MUTABLE_TYPE,
  WALLET_TYPE,
} from '@utils/constants';
import { sendSuccess } from '@utils/send-success';
import { ChangePasswordHRODto } from '../dto/change-password-hro.dto';
import { ForgotPasswordHRODto } from '../dto/forgot-password-hro.dto';
import { LoginAdminDto } from '../dto/login-admin.dto';
import { RegisterHRODto } from '../dto/register-hro.dto';
import { VerifyCodeHRODto } from '../dto/verify-code-hro.dto';
import { ConfigApprovalHroRepository } from '@repositories/config-approval-hro.repository';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateJobTypeRepository } from '@repositories/candidate-job-type.repository';
import { CandidateProvinceRepository } from '@repositories/candidate-province.repository';
import { CandidateInformationFileRepository } from '@repositories/candidate-information-file.repository';

@Injectable()
export class AuthAdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly sequelize: Sequelize,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly hashService: HashService,
    private readonly forgotPasswordRepository: ForgotPasswordRepository,
    private readonly mailService: MailService,
    private readonly notificationService: NotificationService,
    private readonly hroRequestRepository: HroRequestRepository,
    private readonly walletRepository: WalletRepository,
    private readonly walletHistoryRepository: WalletHistoryRepository,
    private readonly userPointRepository: UserPointRepository,
    private readonly userPointHistoryRepository: UserPointHistoryRepository,
  ) {}

  async sigIn(dto: LoginAdminDto): Promise<any> {
    const condition: any = {};
    if (!dto.email && !dto.phone_number) {
      throw new HttpException(
        'Bắt buộc nhập thông tin email hoặc số điện thoại',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (dto.email) {
      condition.email = dto.email;
    }

    if (dto.phone_number) {
      condition.phone_number = dto.phone_number;
    }

    let user = null;

    user = await this.userRepository.findOne({
      where: {
        ...condition,
        role_id: {
          [Op.in]: [
            ROLE.ADMIN,
            ROLE.IMPLEMENTATION_SALE,
            ROLE.RESPONSIBLE_SALE,
            ROLE.HRO,
          ],
        },
        status: { [Op.in]: [IS_ACTIVE.ACTIVE, IS_ACTIVE.INACTIVE] },
      },
    });

    if (!user) {
      user = await this.userRepository.findOne({
        where: {
          ...condition,
          role_id: {
            [Op.in]: [ROLE.CANDIDATE],
          },
          status: { [Op.in]: [IS_ACTIVE.ACTIVE, IS_ACTIVE.INACTIVE] },
        },
      });
    }

    if (!user)
      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new HttpException(
        'Mật khẩu không đúng vui lòng thử lại',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.status == IS_ACTIVE.INACTIVE) {
      throw new HttpException(
        'Tài khoản của bạn bị khóa vui lòng liên hệ quản trị viên để đăng nhập',
        HttpStatus.BAD_REQUEST,
      );
    }
    const token: string = await this.jwtService.signAsync(
      {
        role: user.role_id,
        username: user.full_name,
        phone_number: user.phone_number,
        id: user.id,
        created_at: user.created_at,
      },
      {
        secret: configService.getEnv('JWT_SECRET'),
      },
    );
    await user.update({ token });

    return sendSuccess({
      data: {
        access_token: token,
      },
      msg: 'Đăng nhập thành công',
    });
  }

  async getInfo(user_id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
        role_id: {
          [Op.in]: [
            ROLE.ADMIN,
            ROLE.IMPLEMENTATION_SALE,
            ROLE.RESPONSIBLE_SALE,
            ROLE.HRO,
            ROLE.CANDIDATE,
          ],
        },
      },
      include: [
        {
          model: Wallet,
        },
        {
          model: UserPoint,
        },
      ],
    });

    if (!user)
      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    return sendSuccess({ data: user });
  }

  async register(dto: RegisterHRODto): Promise<any> {
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
    const user = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        try {
          const user: User | undefined = await this.userRepository.create(
            {
              gender_id: dto.gender_id ? dto.gender_id : GENDER.NO_UPDATE,
              role_id: ROLE.HRO,
              password: dto.password,
              full_name: dto.full_name,
              phone_number: dto.phone_number,
              email: dto.email ? dto.email : null,
              avatar: dto.avatar,
              status: USER_STATUS.WAITING,
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
          await this.hroRequestRepository.create(
            {
              user_id: user?.id,
            },
            { transaction },
          );
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
              created_by: user?.id,
            },
            { transaction },
          );
          return user;
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể đăng ký vào lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );
    if (dto?.email) {
      await this.mailService.registerAccountToHRO({
        receiver_email: dto.email,
        subject: `[Alehub] Thông báo đã tiếp nhận thông tin đăng ký`,
        text: {
          logo_url: configService.getEnv('LOGO_URL'),
          hro_full_name: user?.full_name,
        },
      });
    }
    const notificationPayload: NotificationPayload = {
      title: `Bạn vừa nhận được một yêu cầu đăng ký cộng tác viên tuyển dụng - ${user?.full_name}`,
      content: `Bạn vừa nhận được một yêu cầu đăng ký cộng tác viên tuyển dụng - ${user?.full_name}`,
      type: NOTIFICATION_TYPE.REGISTER_HRO,
      data: { user_id: user?.id },
    };
    this.notificationService.createAndSendNotificationForUsers(
      notificationPayload,
      {
        role_id: [ROLE.ADMIN],
      },
    );
    return sendSuccess({ data: user });
  }

  async sendCodeForgotPasswordHRO(dto: ForgotPasswordHRODto): Promise<any> {
    const user: User | null = await this.userRepository.findOne({
      where: {
        phone_number: dto.phone_number,
        role_id: ROLE.HRO,
        status: IS_ACTIVE.ACTIVE,
      },
    });

    if (!user) {
      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.email) {
      throw new HttpException(
        'Email không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const codeForgotPassword = await this.hashService.hashForgotCode(
      user.id,
      user.phone_number,
    );

    try {
      await this.forgotPasswordRepository.create({
        user_id: user.id,
        status: IS_ACTIVE.ACTIVE,
        code: codeForgotPassword,
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra tạo mã không thành công',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      if (user?.email) {
        await this.mailService.sendTestEmail({
          receiver_email: user.email,
          reciever_fullname: user.full_name,
          subject: 'Quên mật khẩu',
          text: codeForgotPassword,
        });
      }
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra tạo mã không thể gửi email xác nhận mật khẩu mới',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let msg = `Alehub đã gửi mã xác nhận tới email. Vui lòng kiểm tra email: ${user.email} để lấy lại mật khẩu`;

    // Hide email
    msg = msg.replace(/(...)(?=@)/, '***');

    return sendSuccess({
      msg,
    });
  }

  async verifyCodeForgotPassword(dto: VerifyCodeHRODto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        role_id: ROLE.HRO,
        phone_number: dto.phone_number,
        status: IS_ACTIVE.ACTIVE,
      },
    });

    if (!user) {
      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const forgotPasswordActive: ForgotPassword | null =
      await this.forgotPasswordRepository.findOne({
        where: {
          user_id: user.id,
          code: dto.code,
          status: IS_ACTIVE.ACTIVE,
        },
      });

    if (!forgotPasswordActive) {
      throw new HttpException(
        'Mã xác nhận không hợp lệ',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return sendSuccess({ msg: 'Xác nhận thành công' });
  }

  async changePasswordForgotHRO(dto: ChangePasswordHRODto): Promise<any> {
    const foundUser = await this.userRepository.findOne({
      where: {
        role_id: ROLE.HRO,
        phone_number: dto.phone_number,
        status: IS_ACTIVE.ACTIVE,
      },
    });
    if (!foundUser) {
      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    // const hashPassword = await this.hashService.passwordUser(
    //   dto.confirm_password,
    // );

    try {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        await foundUser.update(
          {
            password: dto.confirm_password,
          },
          { transaction },
        );

        await this.forgotPasswordRepository.update(
          {
            status: IS_ACTIVE.INACTIVE,
          },
          {
            where: {
              user_id: foundUser.id,
            },
            transaction,
          },
        );
      });
      return sendSuccess({
        msg: 'Xác nhận mật khẩu mới thành công',
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Có lôi xảy ra không thể cập nhật mật khẩu mới',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
