// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Other files
import * as bcrypt from 'bcrypt';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

// Local files
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
import { RegisterHROMiniAppDto } from '../dto/register-hro-mini-app.dto';
import { ConfigApprovalHroRepository } from '@repositories/config-approval-hro.repository';
import { RegisterCandidateMiniAppDto } from '../dto/register-candidate-mini-app.dto';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateJobTypeRepository } from '@repositories/candidate-job-type.repository';
import { CandidateProvinceRepository } from '@repositories/candidate-province.repository';
import { CandidateInformationFileRepository } from '@repositories/candidate-information-file.repository';
import { LoginByQRDto, LoginMiniAppDto } from '../dto/login-mini-app.dto';
import { CreateCareerFavoriteDto } from '../dto/create-career-favorite.dto';
import { UserCareerFavoriteRepository } from '@repositories/user-career-favorite.repository';
import { AcceptReceiveNotiDto } from '../dto/accept-receive-noti.dto';
import {
  UpdateAccountInformationDto,
  UpdateEnterpriseInformationDto,
} from '../dto/update-information.dto';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { EnterPriseAddressRepository } from '@repositories/enterprise-address.repository';
import { EnterpriseAddress } from '@models/enterprise-address.model';
import { CandidateFile } from '@models/candidate-file.model';
import { CandidateInformationFile } from '@models/candidate-information-file.model';
import { CandidateProvince } from '@models/candidate-province.model';
import { DFProvince } from '@models/df-province.model';
import { Application } from '@models/application.model';
import { RecruitmentRequirement } from '@models/recruitment-requirement.model';
import { InterestList } from '@models/interest-list.model';
import { CandidateInformation } from '@models/candidate-information.model';
import { CandidateRecruitment } from '@models/candidate-recruitment.model';
import { CandidateInterview } from '@models/candidate-interview.model';
import { CandidateHireRequirement } from '@models/candidate-hire-requirement.model';
import { CandidateInterest } from '@models/candidate-interest.model';
import { ApplicationCV } from '@models/application-cv.model';
import { MyGateway } from 'src/shared/gateway/gateway';
import { Enterprise } from '@models/enterprise.model';
import { SearchingData } from '@models/searching-data.model';
import { DFCareer } from '@models/df-career.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { SalaryRange } from '@models/salary-range.model';
import { Position } from '@models/position.model';

@Injectable()
export class AuthMiniAppService {
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
    private readonly configApprovalHroRepository: ConfigApprovalHroRepository,
    private readonly candidateInformationRepository: CandidateInformationRepository,
    private readonly candidateJobTypeRepository: CandidateJobTypeRepository,
    private readonly candidateProvinceRepository: CandidateProvinceRepository,
    private readonly candidateInformationFileRepository: CandidateInformationFileRepository,
    private readonly userCareerFavoriteRepository: UserCareerFavoriteRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly enterpriseAddressRepository: EnterPriseAddressRepository,
    private readonly gateway: MyGateway, // Inject MyGateway here
  ) {}

  async getInfo(user_id: number) {
    let user: any = await this.userRepository.findOne({
      where: {
        id: user_id,
        role_id: {
          [Op.in]: [
            ROLE.ADMIN,
            ROLE.IMPLEMENTATION_SALE,
            ROLE.RESPONSIBLE_SALE,
            ROLE.HRO,
            ROLE.CANDIDATE,
            ROLE.COLLABORATOR,
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

    if (user.role_id === ROLE.CANDIDATE || user.role_id === ROLE.COLLABORATOR) {
      const foundCandidateInformation =
        await this.candidateInformationRepository.findOne({
          where: {
            user_id: user.id,
          },
          include: [
            {
              model: CandidateFile,
            },
            {
              model: CandidateInformationFile,
            },
            {
              model: CandidateProvince,
              attributes: ['id', 'candidate_information_id', 'df_province_id'],
              include: [
                {
                  model: DFProvince,
                  attributes: ['id', 'name'],
                },
              ],
            },
          ],
        });

      // Chuyển đổi user sang đối tượng thuần túy
      user = user.toJSON();

      // Gán candidate_information vào user
      user.candidate_information = foundCandidateInformation
        ? foundCandidateInformation.toJSON()
        : null;

      const foundMainApplication = await Application.findOne({
        where: {
          candidate_information_id: foundCandidateInformation?.id,
          is_main: 1,
        },
      });

      user.application_cv_file = foundMainApplication
        ? await ApplicationCV.findOne({
            where: {
              application_id: foundMainApplication?.id,
              is_main: 1,
            },
          })
        : null;
    }

    return sendSuccess({ data: user });
  }

  async getSearchingData(user_id: number) {
    try {
      const foundSearchingData: any = await SearchingData.findOne({
        where: {
          user_id,
        },
      });

      const convert_metadata = JSON.parse(foundSearchingData?.metadata);
      foundSearchingData.dataValues.convert_metadata = convert_metadata;

      const foundProvinces = await DFProvince.findAll({
        where: {
          id: {
            [Op.in]: convert_metadata?.province_ids || [],
          },
        },
        attributes: ['id', 'name', 'value', 'prefix', 'is_active'],
      });
      foundSearchingData.dataValues.convert_metadata.province_ids =
        foundProvinces;

      const foundCareers = await DFCareer.findAll({
        where: {
          id: {
            [Op.in]: convert_metadata?.career_ids || [],
          },
        },
        attributes: ['id', 'name'],
      });
      foundSearchingData.dataValues.convert_metadata.career_ids = foundCareers;

      const foundYearsOfExperience = await YearOfExperience.findAll({
        where: {
          id: {
            [Op.in]: convert_metadata?.years_of_experience_ids || [],
          },
        },
        attributes: ['id', 'description'],
      });
      foundSearchingData.dataValues.convert_metadata.years_of_experience_ids =
        foundYearsOfExperience;

      const foundSalaryRange = await SalaryRange.findAll({
        where: {
          id: {
            [Op.in]: convert_metadata?.salary_range_ids || [],
          },
        },
        attributes: ['id', 'description'],
      });
      foundSearchingData.dataValues.convert_metadata.salary_range_ids =
        foundSalaryRange;

      const foundPositions = await Position.findAll({
        where: {
          id: {
            [Op.in]: convert_metadata?.position_ids || [],
          },
        },
        attributes: ['id', 'name'],
      });
      foundSearchingData.dataValues.convert_metadata.position_ids =
        foundPositions;

      return sendSuccess({ data: foundSearchingData });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getEnterprise(user_id: number) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
    });

    let enterprise: any = null;

    if (foundUser?.enterprise_id) {
      enterprise = await this.enterpriseRepository.findOne({
        where: {
          id: foundUser?.enterprise_id,
        },
        include: [
          {
            model: User,
            as: 'user',
          },
          {
            model: EnterpriseAddress,
          },
        ],
      });
    } else {
      enterprise = await this.enterpriseRepository.findOne({
        where: {
          created_by: user_id,
        },
        include: [
          {
            model: User,
            as: 'user',
          },
          {
            model: EnterpriseAddress,
          },
        ],
      });
    }

    if (!enterprise)
      throw new HttpException(
        'Công ty/ doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );

    return sendSuccess({ data: enterprise });
  }

  async registerHROMiniApp(dto: RegisterHROMiniAppDto): Promise<any> {
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
          const autoApprovalSetting: any =
            await this.configApprovalHroRepository.findAll();
          let allowApprove = true;
          if (autoApprovalSetting?.length !== 0) {
            allowApprove = autoApprovalSetting[0].auto_approval ? true : false;
          }

          const user: User | undefined = await this.userRepository.create(
            {
              gender_id: dto.gender_id ? dto.gender_id : GENDER.NO_UPDATE,
              role_id: ROLE.HRO,
              password: dto.password,
              full_name: dto.full_name,
              phone_number: dto.phone_number,
              email: dto.email ? dto.email : null,
              avatar: dto.avatar ? dto.avatar : null,
              status: allowApprove ? USER_STATUS.ACTIVE : USER_STATUS.WAITING,
            },
            { transaction },
          );

          if (!allowApprove) {
            await this.hroRequestRepository.create(
              {
                user_id: user?.id,
              },
              { transaction },
            );
          }

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

          // * Không khởi tạo +0 điểm ban đầu
          // await this.userPointHistoryRepository.create(
          //   {
          //     user_point_id: userPoint?.id,
          //     type: WALLET_TYPE.ADD,
          //     mutable_type: WALLET_MUTABLE_TYPE.ADD_UPDATE,
          //     value: 0,
          //     current_point: 0,
          //     created_by: user?.id,
          //   },
          //   { transaction },
          // );

          //Send token
          const token: string = await this.jwtService.signAsync(
            {
              role: user?.role_id,
              username: user?.full_name,
              phone_number: user?.phone_number,
              id: user?.id,
              created_at: user?.created_at,
            },
            {
              secret: configService.getEnv('JWT_SECRET'),
            },
          );
          await user?.update({ token, created_by: user.id }, { transaction });

          return { user, access_token: token };
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể đăng ký vào lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );
    // this.mailService.registerAccountToHRO({
    //   receiver_email: dto.email,
    //   subject: `[Alehub] Thông báo đã tiếp nhận thông tin đăng ký`,
    //   text: {
    //     logo_url: configService.getEnv('LOGO_URL'),
    //     hro_full_name: user?.full_name,
    //   },
    // });
    // const notificationPayload: NotificationPayload = {
    //   title: `Bạn vừa nhận được một yêu cầu đăng ký cộng tác viên tuyển dụng - ${user?.full_name}`,
    //   content: `Bạn vừa nhận được một yêu cầu đăng ký cộng tác viên tuyển dụng - ${user?.full_name}`,
    //   type: NOTIFICATION_TYPE.REGISTER_HRO,
    //   data: { user_id: user?.id },
    // };
    // this.notificationService.createAndSendNotificationForUsers(
    //   notificationPayload,
    //   {
    //     role_id: [ROLE.ADMIN],
    //   },
    // );
    return sendSuccess({ data: user, msg: 'Đăng ký HRO thành công' });
  }

  async registerCandidateMiniApp(
    dto: RegisterCandidateMiniAppDto,
  ): Promise<any> {
    if (dto.phone_number) {
      const foundPhoneNumber = await this.userRepository.findOne({
        where: {
          phone_number: dto.phone_number,
          status: { [Op.in]: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE] },
          role_id: dto.role_id,
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
          const candidateInformation =
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

          //Tạo ví hoa hồng cho ứng viên
          const wallet = await this.walletRepository.create(
            {
              user_id: user?.id,
              balance: 0,
            },
            { transaction },
          );
          //* Tạm thời không khởi tạo lịch sử +0 ban đầu
          // await this.walletHistoryRepository.create(
          //   {
          //     wallet_id: wallet?.id,
          //     type: WALLET_TYPE.ADD,
          //     mutable_type: WALLET_MUTABLE_TYPE.ADD_UPDATE,
          //     value: 0,
          //     current_balance: 0,
          //     created_by: user?.id,
          //   },
          //   { transaction },
          // );
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
          throw new HttpException(
            'Có lỗi xảy ra không thể tạo hồ sơ ứng viên vào lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );

    return sendSuccess({
      data: result,
      msg: 'Đăng ký ứng viên thành công',
    });
  }

  async registerCollaboratorMiniApp(
    dto: RegisterCandidateMiniAppDto,
  ): Promise<any> {
    if (dto.phone_number) {
      const foundPhoneNumber = await this.userRepository.findOne({
        where: {
          phone_number: dto.phone_number,
          status: { [Op.in]: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE] },
          role_id: dto.role_id,
        },
      });

      if (foundPhoneNumber) {
        throw new HttpException(
          'Số điện thoại đã đăng ký tài khoản cộng tác viên',
          HttpStatus.FOUND,
        );
      }
    }

    if (dto.email) {
      const foundEmail = await this.userRepository.findOne({
        where: {
          email: dto.email,
          status: { [Op.in]: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE] },
          role_id: { [Op.ne]: [ROLE.COLLABORATOR, ROLE.HRO] },
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
              role_id: ROLE.COLLABORATOR,
              password: dto.password || DEFAULT_PASSWORD,
              full_name: dto.full_name,
              phone_number: dto.phone_number ? dto.phone_number : null,
              email: dto.email ? dto.email : null,
              avatar: dto.avatar ? dto.avatar : null,
              is_real_collaborator: 1,
            },
            transaction,
          );
          const collaboratorInformation =
            await this.candidateInformationRepository.create(
              {
                user_id: user.id,
                created_by: user.id,
                status: CANDIDATE_STATUS.OPEN_CV,
              },
              {
                transaction,
              },
            );

          if (dto.df_province_ids && dto.df_province_ids.length > 0) {
            const candidateProvinceCreated = dto.df_province_ids.map((e) => ({
              candidate_information_id: collaboratorInformation?.id,
              df_province_id: e,
            }));
            await this.candidateProvinceRepository.bulkCreate(
              candidateProvinceCreated,
              { transaction },
            );
          }

          //Tạo ví hoa hồng cho cộng tác viên
          const wallet = await this.walletRepository.create(
            {
              user_id: user?.id,
              balance: 0,
            },
            { transaction },
          );
          //* Tạm thời không khởi tạo lịch sử +0 ban đầu
          // await this.walletHistoryRepository.create(
          //   {
          //     wallet_id: wallet?.id,
          //     type: WALLET_TYPE.ADD,
          //     mutable_type: WALLET_MUTABLE_TYPE.ADD_UPDATE,
          //     value: 0,
          //     current_balance: 0,
          //     created_by: user?.id,
          //   },
          //   { transaction },
          // );
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

          return { collaboratorInformation, access_token: token };
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể tạo tài khoản cộng tác viên vào lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );

    return sendSuccess({
      data: result,
      msg: 'Đăng ký cộng tác viên thành công',
    });
  }

  async signInOnMiniApp(dto: LoginMiniAppDto): Promise<any> {
    const user: any = await this.userRepository.findOne({
      where: {
        phone_number: dto.phone_number,
        role_id: dto.role_id,
        status: { [Op.in]: [IS_ACTIVE.ACTIVE, IS_ACTIVE.INACTIVE] },
        is_real_candidate: dto.role_id === ROLE.CANDIDATE ? 1 : null,
        is_real_collaborator: dto.role_id === ROLE.COLLABORATOR ? 1 : null,
      },
    });
    if (dto.role_id === ROLE.CANDIDATE || dto.role_id === ROLE.COLLABORATOR) {
      if (!user) {
        throw new HttpException(
          'Người dùng không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    } else if (dto.role_id === ROLE.HRO) {
      if (!user) {
        const createdUser = await this.registerHROAccount(dto);

        return sendSuccess({
          data: {
            user: createdUser?.user,
            role_id: createdUser?.role_id,
            access_token: createdUser?.access_token,
          },
          msg: 'Đăng nhập thành công',
        });
      }
    }
    if (user?.status == IS_ACTIVE.INACTIVE) {
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
        user,
        role_id: user?.role_id,
        access_token: token,
      },
      msg: 'Đăng nhập thành công',
    });
  }

  async registerHROAccount(dto: LoginMiniAppDto): Promise<any> {
    //Nếu người dùng chưa tồn tại trong hệ thống => tạo tài khoản
    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        try {
          const autoApprovalSetting: any =
            await this.configApprovalHroRepository.findAll();
          let allowApprove = true;
          if (autoApprovalSetting?.length !== 0) {
            allowApprove = autoApprovalSetting[0].auto_approval ? true : false;
          }

          const user: User | undefined = await this.userRepository.create(
            {
              role_id: ROLE.HRO,
              password: DEFAULT_PASSWORD,
              full_name: dto.full_name,
              phone_number: dto.phone_number,
              avatar: dto.avatar ? dto.avatar : null,
              status: allowApprove ? USER_STATUS.ACTIVE : USER_STATUS.WAITING,
            },
            { transaction },
          );

          if (!allowApprove) {
            await this.hroRequestRepository.create(
              {
                user_id: user?.id,
              },
              { transaction },
            );
          }

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

          //* note không khởi tạo giá trị +0 điểm ban đầu
          // await this.userPointHistoryRepository.create(
          //   {
          //     user_point_id: userPoint?.id,
          //     type: WALLET_TYPE.ADD,
          //     mutable_type: WALLET_MUTABLE_TYPE.ADD_UPDATE,
          //     value: 0,
          //     current_point: 0,
          //     created_by: user?.id,
          //   },
          //   { transaction },
          // );
          //Send token
          const token: string = await this.jwtService.signAsync(
            {
              role: user?.role_id,
              username: user?.full_name,
              phone_number: user?.phone_number,
              id: user?.id,
              created_at: user?.created_at,
            },
            {
              secret: configService.getEnv('JWT_SECRET'),
            },
          );
          await user?.update({ token, created_by: user.id }, { transaction });

          return { user, role_id: user?.role_id, access_token: token };
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể đăng ký vào lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );

    return result;
  }

  async registerCandidateAccount(dto: LoginMiniAppDto): Promise<any> {
    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        try {
          const user: User | undefined = await this.userRepository.createUser(
            {
              role_id: ROLE.CANDIDATE,
              password: DEFAULT_PASSWORD,
              full_name: dto.full_name,
              phone_number: dto.phone_number,
              avatar: dto.avatar ? dto.avatar : null,
            },
            transaction,
          );
          const candidateInformation =
            await this.candidateInformationRepository.create(
              {
                user_id: user.id,
                created_by: user.id,
                status: CANDIDATE_STATUS.OPEN_CV,
              },
              {
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

          return {
            user,
            candidateInformation,
            role_id: user?.role_id,
            access_token: token,
          };
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể tạo hồ sơ ứng viên vào lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );
    return result;
  }

  async createCareerFavorite(
    user_id: number,
    dto: CreateCareerFavoriteDto,
  ): Promise<any> {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: Number(user_id),
      },
    });

    if (!foundUser) {
      throw new HttpException('Không tìm thấy người dùng', HttpStatus.FOUND);
    }

    const payloadCareers = dto.df_career_ids.map((elm) => {
      return {
        user_id: Number(foundUser.id),
        df_career_id: Number(elm),
      };
    });
    await this.userCareerFavoriteRepository.bulkCreate(payloadCareers);

    return sendSuccess({ data: foundUser, msg: 'Tạo thành công' });
  }

  async acceptReceiveNotification(
    user_id: number,
    dto: AcceptReceiveNotiDto,
  ): Promise<any> {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: Number(user_id),
      },
    });

    if (!foundUser) {
      throw new HttpException('Không tìm thấy người dùng', HttpStatus.FOUND);
    }

    await this.userRepository.update(
      {
        is_receive_notification: dto.is_receive_notification,
      },
      {
        where: {
          id: foundUser.id,
        },
      },
    );

    return sendSuccess({ data: foundUser, msg: 'Xác nhận thành công' });
  }

  async updateAccountInformation(
    user_id: number,
    dto: UpdateAccountInformationDto,
  ): Promise<any> {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: Number(user_id),
      },
    });

    if (!foundUser) {
      throw new HttpException(
        'Không tìm thấy người dùng',
        HttpStatus.NOT_FOUND,
      );
    }
    if (dto.email) {
      const foundEmail = await this.userRepository.findOne({
        where: {
          email: dto.email,
          id: {
            [Op.ne]: Number(user_id),
          },
        },
      });

      if (foundEmail) {
        throw new HttpException(
          'Email đã tồn tại trên hệ thống',
          HttpStatus.FOUND,
        );
      }
    }
    const updatePlayload = {
      gender_id: dto.gender_id ? dto.gender_id : null,
      full_name: dto.full_name,
      email: dto.email ? dto.email : null,
      avatar: dto.avatar ? dto.avatar : null,
      date_of_birth: dto.date_of_birth ? dto.date_of_birth : null,
    };

    await this.userRepository.update(updatePlayload, {
      where: {
        id: foundUser.id,
      },
    });

    if (
      foundUser.role_id === ROLE.CANDIDATE ||
      foundUser.role_id === ROLE.COLLABORATOR
    ) {
      const foundCandidateInformation =
        await this.candidateInformationRepository.findOne({
          where: {
            user_id: foundUser.id,
          },
        });

      if (!foundCandidateInformation) {
        throw new HttpException(
          'Không tìm thấy thông tin ứng viên/ cộng tác viên',
          HttpStatus.NOT_FOUND,
        );
      }

      if (dto.files) {
        const dataCreated = dto.files.map((e) => ({
          candidate_information_id: foundCandidateInformation?.id,
          file: e.file,
          file_name: e.file_name,
        }));
        await this.candidateInformationFileRepository.bulkCreate(dataCreated);
      }

      if (dto.delete_file_ids && dto.delete_file_ids.length > 0) {
        await this.candidateInformationFileRepository.update(
          {
            deleted_at: new Date(),
          },
          {
            where: {
              id: {
                [Op.in]: [...dto.delete_file_ids],
              },
            },
          },
        );
      }
    }

    const userAfterUpdate = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
    });

    return sendSuccess({ data: userAfterUpdate, msg: 'Cập nhật thành công' });
  }

  async updateEnterpriseInformation(
    user_id: number,
    dto: UpdateEnterpriseInformationDto,
  ): Promise<any> {
    let enterpriseAfterUpdate: any = '';
    if (dto.enterprise_id) {
      //Trường hợp cập nhật /edit
      const foundEnterprise = await this.enterpriseRepository.findOne({
        where: {
          id: dto.enterprise_id,
        },
      });

      if (!foundEnterprise) {
        throw new HttpException(
          'Công ty/ Doanh nghiệp không tồn tại!',
          HttpStatus.NOT_FOUND,
        );
      }

      //Tìm người đại diện
      const foundManager = await this.userRepository.findOne({
        where: {
          id: foundEnterprise.user_id,
          // created_by: user_id,
        },
      });

      if (!foundManager) {
        throw new HttpException(
          'Người đại diện của Công ty/ Doanh nghiệp không tồn tại!',
          HttpStatus.NOT_FOUND,
        );
      }

      //Check giá trị tạo công ty/doanh nghiệp
      const phoneNumber = await this.userRepository.findOne({
        where: {
          phone_number: dto.phone_number,
          id: {
            [Op.ne]: foundManager.id,
          },
          enterprise_id: {
            [Op.ne]: foundEnterprise.id,
          },
        },
      });

      if (phoneNumber) {
        throw new HttpException(
          'Số điện thoại đã được đăng ký. Vui lòng đăng ký bằng số điện thoại khác!',
          HttpStatus.FOUND,
        );
      }

      const foundEmail = await this.userRepository.findOne({
        where: {
          email: dto.email,
          id: {
            [Op.ne]: foundManager.id,
          },
        },
      });

      if (foundEmail) {
        throw new HttpException(
          'Email đã tồn tại trên hệ thống',
          HttpStatus.FOUND,
        );
      }

      if (dto?.tax_code) {
        const foundTaxCode = await this.enterpriseRepository.findOne({
          where: {
            tax_code: dto?.tax_code,
            id: {
              [Op.ne]: foundEnterprise.id,
            },
          },
        });

        if (foundTaxCode) {
          throw new HttpException(
            'Mã số thuế đã tồn tại trên hệ thống',
            HttpStatus.FOUND,
          );
        }
      }

      await this.sequelize.transaction(async (transaction: Transaction) => {
        // Tạo dữ liệu công ty/doanh nghiệp
        const payloadUpdateUser: any = {
          full_name: dto?.manager || null,
          email: dto.email,
          phone_number: dto.phone_number,
        };

        await this.userRepository.update(payloadUpdateUser, {
          where: {
            id: foundManager.id,
          },
          transaction,
        });

        const payloadUpdateEnterprise: any = {
          position: dto?.position || null,
          name: dto?.enterprise_name,
          tax_code: dto?.tax_code || null,
          logo: dto?.logo,
          manager: dto?.manager,
        };

        await this.enterpriseRepository.update(payloadUpdateEnterprise, {
          where: {
            id: foundEnterprise.id,
          },
          transaction,
        });

        // Xoá địa chỉ công ty cũ
        await this.enterpriseAddressRepository.update(
          {
            deleted_at: new Date(),
          },
          {
            where: {
              enterprise_id: foundEnterprise.id,
            },
            transaction,
          },
        );

        await this.enterpriseAddressRepository.create(
          {
            enterprise_id: foundEnterprise.id,
            df_province_id: dto?.province || null,
            df_district_id: dto?.district || null,
            df_ward_id: dto?.ward || null,
            name: dto?.address,
            address: dto?.address,
          },
          { transaction },
        );
        //Cập nhật thông tin của HR thuộc doanh nghiệp này (nếu chưa có)
        await User.update(
          {
            enterprise_id: foundEnterprise.id,
          },
          {
            where: {
              id: user_id,
            },
            transaction,
          },
        );
      });

      enterpriseAfterUpdate = await this.enterpriseRepository.findOne({
        where: {
          id: foundEnterprise.id,
        },
      });
    } else {
      //Trường hợp thêm mới
      //Check giá trị tạo công ty/doanh nghiệp
      const phoneNumber = await this.userRepository.foundPhoneNumberEnterprise(
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

      const foundEmail = await this.userRepository.foundEmail(dto.email);

      if (foundEmail) {
        throw new HttpException(
          'Email đã tồn tại trên hệ thống',
          HttpStatus.FOUND,
        );
      }

      if (dto?.tax_code) {
        const foundTaxCode = await this.enterpriseRepository.findOne({
          where: {
            tax_code: dto?.tax_code,
          },
        });
        if (foundTaxCode) {
          throw new HttpException(
            'Mã số thuế đã tồn tại trên hệ thống',
            HttpStatus.FOUND,
          );
        }
      }

      const result = await this.sequelize.transaction(
        async (transaction: Transaction) => {
          // Tạo dữ liệu công ty/doanh nghiệp
          const payloadCreateUser: any = {
            full_name: dto?.manager || null,
            email: dto.email,
            phone_number: dto.phone_number,
            // alternate_phone: dto?.alternate_phone || null,
            verify_password: DEFAULT_PASSWORD,
            created_by: user_id,
          };

          const user = await this.userRepository.createEnterpriseAdmin(
            payloadCreateUser,
            ROLE.ENTERPRISE,
            transaction,
          );

          const payloadCreateEnterprise: any = {
            position: dto?.position || null,
            name: dto?.enterprise_name,
            tax_code: dto?.tax_code || null,
            logo: dto?.logo,
            status: IS_ACTIVE.ACTIVE,
            user_id: user.id,
            manager: user.full_name,
            created_by: user_id,
          };

          const enterprise: any = await this.enterpriseRepository.create(
            payloadCreateEnterprise,
            { transaction },
          );

          //Tạo mới ví doanh nghiệp (người đại diện)
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

          await this.enterpriseAddressRepository.create(
            {
              enterprise_id: enterprise.id,
              df_province_id: dto?.province || null,
              df_district_id: dto?.district || null,
              df_ward_id: dto?.ward || null,
              name: dto?.address,
              address: dto?.address,
            },
            { transaction },
          );

          //Cập nhật thông tin của HR thuộc doanh nghiệp này
          await User.update(
            {
              enterprise_id: enterprise.id,
            },
            {
              where: {
                id: user_id,
              },
              transaction,
            },
          );

          return enterprise;
        },
      );

      enterpriseAfterUpdate = result;
    }

    return sendSuccess({
      data: enterpriseAfterUpdate,
      msg: 'Cập nhật thành công',
    });
  }

  async deleteAccount(user_id: number): Promise<any> {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: Number(user_id),
      },
    });

    if (!foundUser) {
      throw new HttpException(
        'Không tìm thấy người dùng',
        HttpStatus.NOT_FOUND,
      );
    }
    if (foundUser.role_id === ROLE.HRO) {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        await foundUser.update(
          { deleted_at: new Date(), token: null },
          { transaction },
        );

        //Xoá các tin tuyển dụng đã đăng
        await RecruitmentRequirement.update(
          {
            deleted_at: new Date(),
          },
          {
            where: {
              created_by: foundUser.id,
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
              user_id,
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
              user_id,
            },
            transaction,
          },
        );
      });
    } else if (
      foundUser.role_id === ROLE.CANDIDATE ||
      foundUser.role_id === ROLE.COLLABORATOR
    ) {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        const foundCandidateInformation = await CandidateInformation.findOne({
          where: {
            user_id: foundUser.id,
          },
        });
        await this.userRepository.update(
          {
            deleted_at: new Date(),
            token: null,
          },
          {
            where: { id: foundUser.id },
            transaction,
          },
        );

        if (foundCandidateInformation) {
          await CandidateInformation.update(
            { deleted_at: new Date() },
            {
              where: {
                user_id: foundUser.id,
              },
              transaction,
            },
          );

          await InterestList.destroy({
            where: { candidate_information_id: foundCandidateInformation.id },
            transaction,
          });
          await CandidateRecruitment.destroy({
            where: { candidate_information_id: foundCandidateInformation.id },
            transaction,
          });
          await CandidateInterview.destroy({
            where: { candidate_information_id: foundCandidateInformation.id },
            transaction,
          });
          await CandidateHireRequirement.destroy({
            where: { candidate_information_id: foundCandidateInformation.id },
            transaction,
          });

          await CandidateInterest.destroy({
            where: { candidate_information_id: foundCandidateInformation.id },
            transaction,
          });

          await Application.destroy({
            where: { candidate_information_id: foundCandidateInformation.id },
            transaction,
          });
        }
      });
    }

    return sendSuccess({ msg: 'Xoá tài khoản thành công' });
  }

  async loginByQR(dto: LoginByQRDto): Promise<any> {
    let user: any = await this.userRepository.findOne({
      where: {
        phone_number: dto.phone_number,
        role_id: Number(dto.role_id),
        status: { [Op.in]: [IS_ACTIVE.ACTIVE, IS_ACTIVE.INACTIVE] },
      },
    });
    if (!user) {
      // Emit login-fail event
      this.gateway.emitLoginFailure(dto.socket_id, {
        msg: 'Người dùng không tồn tại trên hệ thống',
        status_code: HttpStatus.NOT_FOUND,
        access_token: null,
        socket_id: dto.socket_id,
        user: null,
      });

      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.role_id === ROLE.HRO) {
      if (!user.enterprise_id) {
        this.gateway.emitLoginFailure(dto.socket_id, {
          msg: 'Tài khoản không thuộc doanh nghiệp nào',
          status_code: HttpStatus.NOT_FOUND,
          access_token: null,
          socket_id: dto.socket_id,
          user: null,
        });

        throw new HttpException(
          'Tài khoản không thuộc doanh nghiệp nào',
          HttpStatus.NOT_FOUND,
        );
      }
      const foundEnterprise: any = await Enterprise.findOne({
        where: {
          id: user.enterprise_id,
        },
      });
      if (!foundEnterprise) {
        this.gateway.emitLoginFailure(dto.socket_id, {
          msg: 'Doanh nghiệp không tồn tại',
          status_code: HttpStatus.NOT_FOUND,
          access_token: null,
          socket_id: dto.socket_id,
          user: null,
        });

        throw new HttpException(
          'Doanh nghiệp không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }

      user = await this.userRepository.findOne({
        where: {
          id: foundEnterprise.user_id,
        },
      });
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
