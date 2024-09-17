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
  CANDIDATE_STATUS,
  DEFAULT_PASSWORD,
  IS_ACTIVE,
  NOTIFICATION_TYPE,
  NotificationPayload,
  ROLE,
  USER_STATUS,
  WALLET_MUTABLE_TYPE,
  WALLET_TYPE,
} from '@utils/constants';
import { sendSuccess } from '@utils/send-success';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ForgotPasswordVerifyCandidateDto } from '../dto/forgot-password-verify-candidate.dto';
import { CandidateLoginDto, LoginByQRDto } from '../dto/login-candidate.dto';
import { RegisterCandidateDto } from '../dto/register-candidate.dto';
import { CandidateProvinceRepository } from '@repositories/candidate-province.repository';
import { CandidateInterestRepository } from '@repositories/candidate-interest.repository';
import { CandidateInterestCareerRepository } from '@repositories/candidate-interest-career.repository';
import { MyGateway } from 'src/shared/gateway/gateway';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { saveSearchingDataFromInterest } from '@utils/save-searching';

@Injectable()
export class AuthCandidateService {
  constructor(
    private readonly forgotPasswordRepository: ForgotPasswordRepository,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly candidateInformationRepository: CandidateInformationRepository,
    private readonly candidateProvinceRepository: CandidateProvinceRepository,
    private readonly walletRepository: WalletRepository,
    private readonly candidateInterestRepository: CandidateInterestRepository,
    private readonly candidateInterestCareerRepository: CandidateInterestCareerRepository,
    private sequelize: Sequelize,
    private readonly gateway: MyGateway, // Inject MyGateway here
  ) {}

  async verifyCodeForgotPasswordEnterprise(
    dto: ForgotPasswordVerifyCandidateDto,
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

  // async sendCodeForgotPasswordEnterPrise(
  //   dto: ForgotPasswordEnterPriseDto,
  // ): Promise<any> {
  //   const user: User | null = await this.userRepository.findOne({
  //     where: {
  //       phone_number: dto.phone_number,
  //       role_id: ROLE.ENTERPRISE,
  //     },
  //   });

  //   if (!user) {
  //     throw new HttpException(
  //       'Người dùng không tồn tại trên hệ thống',
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   if (!user.email) {
  //     throw new HttpException(
  //       'Email không tồn tại trên hệ thống',
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   const codeForgotPassword = await hashService.hashForgotCode(
  //     user.id,
  //     user.phone_number,
  //   );

  //   try {
  //     await this.forgotPasswordRepository.create({
  //       user_id: user.id,
  //       status: IS_ACTIVE.ACTIVE,
  //       code: codeForgotPassword,
  //     });
  //   } catch (error) {
  //     throw new HttpException(
  //       'Có lỗi xảy ra tạo mã không thành công',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }

  //   try {
  //     if (user?.email) {
  //       await this.mailService.sendTestEmail({
  //         receiver_email: user.email,
  //         reciever_fullname: user.full_name,
  //         subject: 'Quên mật khẩu',
  //         text: codeForgotPassword,
  //       });
  //     }
  //   } catch (error) {
  //     throw new HttpException(
  //       'Có lỗi xảy ra tạo mã không thể gửi email xác nhận mật khẩu mới',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }

  //   let msg = `Vui lòng kiểm tra AleHub ${user.email} để lấy lại mật khẩu`;

  //   // Hide email
  //   msg = msg.replace(/(...)(?=@)/, '***');

  //   return sendSuccess({
  //     msg,
  //   });
  // }

  async signIn(dto: CandidateLoginDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        [Op.or]: [
          {
            phone_number: dto.account,
          },
          {
            email: dto.account,
          },
        ],
        role_id: ROLE.CANDIDATE,
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
      if (user.status == IS_ACTIVE.INACTIVE) {
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

  async registerCandidate(dto: RegisterCandidateDto): Promise<any> {
    if (dto.phone_number) {
      const foundPhoneNumber = await this.userRepository.findOne({
        where: {
          phone_number: dto.phone_number,
          status: { [Op.in]: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE] },
          role_id: ROLE.CANDIDATE,
          is_real_candidate: 1,
        },
      });

      if (foundPhoneNumber) {
        throw new HttpException(
          'Số điện thoại đã đăng ký tài khoản ứng viên',
          HttpStatus.FOUND,
        );
      }
    }

    if (dto.email) {
      const foundEmail = await this.userRepository.findOne({
        where: {
          email: dto.email,
          status: { [Op.in]: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE] },
          role_id: { [Op.ne]: [ROLE.CANDIDATE, ROLE.HRO] },
        },
      });

      if (foundEmail) {
        throw new HttpException(
          'Email đã tồn tại trên hệ thống',
          HttpStatus.FOUND,
        );
      }
    }

    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        try {
          const user: User | undefined = await this.userRepository.createUser(
            {
              gender_id: dto.gender_id ? dto.gender_id : null,
              role_id: ROLE.CANDIDATE,
              password: dto.password || DEFAULT_PASSWORD,
              full_name: dto.full_name,
              phone_number: dto.phone_number ? dto.phone_number : null,
              email: dto.email ? dto.email : null,
              avatar: dto.avatar ? dto.avatar : null,
              is_real_candidate: 1,
            },
            transaction,
          );
          const candidateInformation: any =
            await this.candidateInformationRepository.create(
              {
                user_id: user.id,
                created_by: user.id,
                status: CANDIDATE_STATUS.OPEN_CV,
                is_recruitment: IS_ACTIVE.ACTIVE,
              },
              {
                transaction,
              },
            );

          if (dto.df_province_ids && dto.df_province_ids.length > 0) {
            const candidateProvinceCreated = dto.df_province_ids.map((e) => ({
              candidate_information_id: candidateInformation?.id,
              df_province_id: e,
            }));
            await this.candidateProvinceRepository.bulkCreate(
              candidateProvinceCreated,
              { transaction },
            );
          }

          // //Tạo ví hoa hồng cho ứng viên //Nghiệp vụ mới Ứng viên không có ví hoa hồng (chỉ áp dụng cho cộng tác viên)
          // const wallet = await this.walletRepository.create(
          //   {
          //     user_id: user?.id,
          //     balance: 0,
          //   },
          //   { transaction },
          // );

          //Tạo bằng cấp cao nhất, số năm kinh nghiệm , vị trí chức vụ mong muốn, mức lương mong muốn của ứng viên
          const payloadCreate = {
            candidate_information_id: candidateInformation.id,
            df_degree_id: dto.degree_id,
            year_of_experience_id: dto.year_of_experience_id,
            position_id: dto.position_id,
            salary_range_id: dto.salary_range_id,
          };
          const candidateInterest =
            await this.candidateInterestRepository.create(payloadCreate, {
              transaction,
            });
          //Tạo nghề nghiệp quan tâm
          if (dto.career_ids && dto.career_ids.length > 0) {
            const careerListCreated = dto.career_ids.map((e: any) => ({
              candidate_interest_id: candidateInterest?.id,
              df_career_id: e,
            }));
            await this.candidateInterestCareerRepository.bulkCreate(
              careerListCreated,
              { transaction },
            );
          }
          // Cập nhật số năm kinh nghiệm, mức lương và bằng cấp(candidate information)
          await this.candidateInformationRepository.update(
            {
              salary_range_id: dto.salary_range_id,
              years_of_experience_id: dto.year_of_experience_id,
              degree_id: dto.degree_id,
            },
            {
              where: {
                id: candidateInformation.id,
              },
              transaction,
            },
          );

          //Send token
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
          await user.update({ token, created_by: user.id }, { transaction });

          return { candidateInformation, access_token: token };
        } catch (error) {
          console.log('ERROR---->', error);
          throw new HttpException(
            'Có lỗi xảy ra không thể tạo tài khoản ứng viên vào lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );

    //Lưu thông tin data quan tâm vào thông tin lưu bộ lọc
    await saveSearchingDataFromInterest(
      result?.candidateInformation.user_id,
      {
        // province_ids: province_ids
        //   ?.split(',')
        //   .map((id: any) => parseInt(id)),
        career_ids: dto.career_ids,
        years_of_experience_ids: dto.year_of_experience_id,
        salary_range_ids: dto.salary_range_id,
        position_ids: dto.position_id,
      },
      result?.candidateInformation.id,
    );

    return sendSuccess({
      data: result,
      msg: 'Đăng ký ứng viên thành công',
    });
  }

  async loginByQR(dto: LoginByQRDto): Promise<any> {
    let user: any = await this.userRepository.findOne({
      where: {
        phone_number: dto.phone_number,
        role_id: ROLE.CANDIDATE,
        status: { [Op.in]: [IS_ACTIVE.ACTIVE, IS_ACTIVE.INACTIVE] },
      },
    });
    if (!user) {
      //Tìm tk Cộng tác viên
      const foundCollaborator = await await this.userRepository.findOne({
        where: {
          phone_number: dto.phone_number,
          role_id: ROLE.COLLABORATOR,
          status: IS_ACTIVE.ACTIVE,
        },
      });
      // Emit login-fail event
      this.gateway.emitLoginFailure(dto.socket_id, {
        msg: 'Người dùng không tồn tại trên hệ thống',
        status_code: HttpStatus.NOT_FOUND,
        access_token: null,
        socket_id: dto.socket_id,
        user: null,
        collaborator: foundCollaborator || null,
      });

      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user?.status == IS_ACTIVE.INACTIVE) {
      // Emit login-fail event
      this.gateway.emitLoginFailure(dto.socket_id, {
        msg: 'Tài khoản của bạn bị khóa vui lòng liên hệ quản trị viên để đăng nhập',
        status_code: HttpStatus.BAD_REQUEST,
        access_token: null,
        socket_id: dto.socket_id,
        user: null,
      });

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
    // Emit login-success event
    this.gateway.emitLoginSuccess(dto.socket_id, {
      access_token: token,
      socket_id: dto.socket_id,
      user,
    });

    return sendSuccess({
      data: {
        access_token: token,
        socket_id: dto.socket_id,
        user,
      },
      msg: 'Đăng nhập thành công',
    });
  }
}
