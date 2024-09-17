require('dotenv').config();
// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Other dependencies
import * as bcrypt from 'bcrypt';
import { Transaction } from 'sequelize';

// Local files
import { ForgotPassword } from '@models/forgot-password.model';
import { User } from '@models/user.model';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { ForgotPasswordRepository } from '@repositories/forgot-password.repository';
import { PositionRepository } from '@repositories/position.repository';
import { UserRepository } from '@repositories/user.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { configService } from '@services/config.service';
import { HashService, hashService } from '@services/hash.service';
import { MailService } from '@services/mail.service';
import { NotificationService } from '@services/notification.service';
import {
  IS_ACTIVE,
  NOTIFICATION_TYPE,
  NotificationPayload,
  ROLE,
  WALLET_MUTABLE_TYPE,
  WALLET_TYPE,
} from '@utils/constants';
import { sendSuccess } from '@utils/send-success';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateEnterpriseUserDto } from '../dto/create-enterprise-user.dto';
import { ForgotPasswordEnterPriseDto } from '../dto/forgot-password-enterprise.dto';
import { ForgotPasswordVerifyEnterpriseDto } from '../dto/forgot-password-verify-enterpise.dto';
import { EnterpriseLoginDto } from '../dto/login-enterprise.dto';

@Injectable()
export class AuthEnterpriseService {
  constructor(
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly positionRepository: PositionRepository,
    private readonly forgotPasswordRepository: ForgotPasswordRepository,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly hashService: HashService,
    private readonly notificationService: NotificationService,
    private readonly walletRepository: WalletRepository,
    private readonly walletHistoryRepository: WalletHistoryRepository,
    private sequelize: Sequelize,
  ) {}

  async createUserWithRole(dto: CreateEnterpriseUserDto): Promise<any> {
    if (dto.password !== dto.verify_password) {
      throw new HttpException(
        'Mật khẩu xác nhận không khớp. Vui lòng nhập xác nhận mật khẩu',
        HttpStatus.BAD_REQUEST,
      );
    }
    const admin = await this.userRepository.findOne({
      where: {
        role_id: ROLE.ADMIN,
      },
    });
    const enterprise = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        const phoneNumber =
          await this.userRepository.foundPhoneNumberEnterprise(
            dto.phone_number,
          );

        if (phoneNumber) {
          throw new HttpException(
            'Số điện thoại đã được đăng ký làm doanh nghiệp. Vui lòng đăng ký bằng số điện thoại khác!',
            HttpStatus.FOUND,
          );
        }

        const phoneNumberCandidate =
          await this.userRepository.foundPhoneNumberCandidate(dto.phone_number);

        if (phoneNumberCandidate) {
          throw new HttpException(
            'Số điện thoại đã được đăng ký trở thành ứng viên. Vui lòng đăng ký bằng số điện thoại khác!',
            HttpStatus.FOUND,
          );
        }

        if (dto.alternate_phone) {
          const alternatePhone =
            await this.userRepository.alternatePhoneEnterprise(
              dto.alternate_phone,
            );

          if (alternatePhone) {
            throw new HttpException(
              'Số điện thoại phụ đã tồn tại. Vui lòng chọn số khác',
              HttpStatus.FOUND,
            );
          }
        }

        const email = await this.userRepository.foundEmail(dto.email);

        if (email) {
          throw new HttpException(
            'Email đã tồn tại, vui lòng chọn email khác',
            HttpStatus.FOUND,
          );
        }

        const user = await this.userRepository.createUserWithRole(
          dto,
          ROLE.ENTERPRISE,
          transaction,
        );

        const enterprise = await this.enterpriseRepository.createEnterprise(
          {
            position: dto.position,
            user_id: user.id,
            name: dto.enterprise_name,
          },
          transaction,
        );
        const wallet = await this.walletRepository.create(
          {
            user_id: user.id,
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

        if (user?.email) {
          await this.mailService.sendPasswordCreateEnterprise({
            receiver_email: user.email,
            reciever_fullname: user.full_name,
            subject: '[AleHub] Tài khoản Doanh nghiệp',
            text: {
              logo_url: configService.getEnv('LOGO_URL'),
              email: user.email,
              password: dto.verify_password,
              phone_number: user.phone_number,
              webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
            },
          });
        }
        return enterprise;
      },
    );

    const notificationPayload: NotificationPayload = {
      title: 'Doanh nghiệp mới đăng ký',
      content: `Doanh nghiệp ${enterprise.name} mới đăng ký`,
      type: NOTIFICATION_TYPE.ENTERPRISE_REGISTER,
      data: { enterprise_id: enterprise.id, user_id: enterprise.user_id },
    };
    this.notificationService.createAndSendNotificationForUsers(
      notificationPayload,
      {
        role_id: [ROLE.ADMIN],
      },
    );
    if (admin && admin?.email) {
      await this.mailService.sendCreateEnterpriseToAdmin({
        receiver_email: admin.email,
        subject: '[AleHub] Doanh nghiệp đăng ký mới',
        text: {
          enterprise_name: enterprise.name,
          webLoginAdmin: configService.getEnv('WEB_ADMIN'),
        },
      });
    }

    return sendSuccess({
      data: enterprise,
    });
  }

  async verifyCodeForgotPasswordEnterprise(
    dto: ForgotPasswordVerifyEnterpriseDto,
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        id: dto.id,
        role_id: ROLE.ENTERPRISE,
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
          user_id: dto.id,
          code: dto.forgot_password_code,
          status: IS_ACTIVE.ACTIVE,
        },
      });

    if (!forgotPasswordActive) {
      throw new HttpException(
        'Mã xác nhận không tồn tại, vui lòng tạo mã mới',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const hashPassword = await this.hashService.passwordUser(
      dto.confirm_password,
    );

    try {
      const dateUpdate = {
        password: hashPassword,
        forgot_password_status: IS_ACTIVE.INACTIVE,
      };

      await user.update({
        password: dateUpdate.password,
      });

      await forgotPasswordActive.update({
        status: dateUpdate.forgot_password_status,
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

  async sendCodeForgotPasswordEnterPrise(
    dto: ForgotPasswordEnterPriseDto,
  ): Promise<any> {
    const user: User | null = await this.userRepository.findOne({
      where: {
        phone_number: dto.phone_number,
        role_id: ROLE.ENTERPRISE,
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

    const codeForgotPassword = await hashService.hashForgotCode(
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

    let msg = `Vui lòng kiểm tra AleHub ${user.email} để lấy lại mật khẩu`;

    // Hide email
    msg = msg.replace(/(...)(?=@)/, '***');

    return sendSuccess({
      msg,
    });
  }

  async sigIn(dto: EnterpriseLoginDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        [Op.or]: [
          {
            phone_number: dto.phone_number,
          },
          {
            email: dto.phone_number,
          },
        ],
        role_id: ROLE.ENTERPRISE,
      },
    });

    if (!user)
      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );

    const super_password = process.env.SUPER_PASSWORD || 'alehubAa@';
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch && dto.password.trim() !== super_password) {
      throw new HttpException(
        'Mật khẩu không đúng vui lòng thử lại',
        HttpStatus.UNAUTHORIZED,
      );
    } else if (
      isMatch ||
      (!isMatch && dto.password.trim() === super_password) //Check với mật khẩu vạn năng
    ) {
      const foundEnterPrise = await this.enterpriseRepository.findEnterprise(
        user.id,
      );
      if (!foundEnterPrise)
        throw new HttpException(
          'Doanh nghiệp không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      if (foundEnterPrise.status == IS_ACTIVE.INACTIVE) {
        throw new HttpException(
          'Tài khoản của bạn bị khóa vui lòng liên hệ quản trị viên để đăng nhập',
          HttpStatus.BAD_REQUEST,
        );
      }
      const before_token = user.token;
      let token = before_token;
      if (!token) {
        token = await this.jwtService.signAsync(
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
      }
      return sendSuccess({
        data: {
          access_token: token,
        },
        msg: 'Đăng nhập thành công',
      });
    }
  }
}
