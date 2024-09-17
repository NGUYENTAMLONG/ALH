//Nest dependencies
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
// Other dependencies
import { Op, Transaction, where } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
//Local files
import { AgeGroup } from '@models/age-group.model';
import { CandidateInformation } from '@models/candidate-information.model';
import { CandidateRecruitment } from '@models/candidate-recruitment.model';
import { DFProvince } from '@models/df-province.model';
import { Enterprise } from '@models/enterprise.model';
import { FeeOfRecruitmentRequirement } from '@models/fee-of-recruitment-requirement.model';
import { FeeType } from '@models/fee-type.model';
import { ProfessionalField } from '@models/professional-field.model';
import { RecruitmentJobType } from '@models/recruitment-job-type.model';
import { RecruitmentRequirementFile } from '@models/recruitment-requirement-file.model';
import { RecruitmentRequirementHistory } from '@models/recruitment-requirement-history.model';
import { RecruitmentRequirementHro } from '@models/recruitment-requirement-hro.model';
import { RecruitmentRequirementImplementation } from '@models/recruitment-requirement-implementation.model';
import { RecruitmentRequirementProvince } from '@models/recruitment-requirement-province.model';
import { SalaryRange } from '@models/salary-range.model';
import { User } from '@models/user.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { AgeGroupRepository } from '@repositories/age-group.repository';
import { CandidateInterviewRepository } from '@repositories/candidate-interview.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { FeeOfRecruitmentRequirementRepository } from '@repositories/fee-of-recruitment-requirement.repository';
import { GenderRepository } from '@repositories/gender.repository';
import { JobTypeRepository } from '@repositories/job-type.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { RecruitmentJobTypeRepository } from '@repositories/recruitment-job-type.repository';
import { RecruitmentRequirementFileRepository } from '@repositories/recruitment-requirement-file.repository';
import { RecruitmentRequirementHistoryRepository } from '@repositories/recruitment-requirement-history.repository';
import { RecruitmentRequirementHroRepository } from '@repositories/recruitment-requirement-hro.repository';
import { RecruitmentRequirementImplementationRepository } from '@repositories/recruitment-requirement-implementation.repository';
import { RecruitmentRequirementProvinceRepository } from '@repositories/recruitment-requirement-province.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { SalaryRangeRepository } from '@repositories/salary-range.repository';
import { UserRepository } from '@repositories/user.repository';
import { YearOfExperienceRepository } from '@repositories/year-of-experience.repository';
import { configService } from '@services/config.service';
import { MailService } from '@services/mail.service';
import { NotificationService } from '@services/notification.service';
import {
  CANDIDATE_RECRUITMENT_STATUS,
  DEFAULT_PASSWORD,
  IS_ACTIVE,
  NOTIFICATION_TYPE,
  NotificationPayload,
  POINT_MUTABLE_TYPE,
  POINT_TYPE,
  RECRUITMENT_STATUS,
  ROLE,
  TYPE_OF_FEE,
  USER_STATUS,
  WALLET_MUTABLE_TYPE,
  WALLET_TYPE,
} from '@utils/constants';
import { createArrayObjectByKey } from '@utils/create-array-object-by-key';
import { convertDateTime } from '@utils/date-time';
import { generateUniqueWEPKey } from '@utils/generate-code-recruitment';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { CreateEnterPriseHroDto } from '../dto/hro-create-enterprise.dto';
import { EnterPriseAddressRepository } from '@repositories/enterprise-address.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import _ from 'lodash';
import {
  HROCreateRecruitmentDto,
  HROCreateRecruitmentWithEnterperiseDto,
} from '../dto/create-recruitment.dto';
import { DFCareerRepository } from '@repositories/df-career.repository';
import {
  MiniAppFilterRecruitmentByHRODto,
  MiniAppFilterRecruitmentByCandidateDto,
} from '../dto/filter-recruitment.dto';
import { EnterpriseAddress } from '@models/enterprise-address.model';
import { UserRecruitmentFavoriteRepository } from '@repositories/user-recruitment-favorite.repository';
import {
  HROUpdateRecruitmentWithEnterperiseDto,
  RecruitmentRequirementDto,
} from '../dto/update-recruitment.dto';
import { PositionRepository } from '@repositories/position.repository';
import { DFWard } from '@models/df-ward.model';
import { DFDistrict } from '@models/df-district.model';
import { Position } from '@models/position.model';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateApplyRepository } from '@repositories/candidate-apply.repository';
import { CandidateApplyFileRepository } from '@repositories/candidate-apply-file.repository';
import { UserPointRepository } from '@repositories/user-point.repository';
import { ConfigPointHroRepository } from '@repositories/config-point-hro.repository';
import { UserPointHistoryRepository } from '@repositories/user-point-history.repository';
import { CandidateApplyFile } from '@models/candidate-apply-file.model';
import * as moment from 'moment';
import { adminApprovesRecruitmentTemplate } from 'src/shared/zalo-templates/templates';
import { sendZaloMessage } from '@utils/send-zalo-message';
import { SearchingData } from '@models/searching-data.model';
import { saveSearchingData } from '@utils/save-searching';
@Injectable()
export class MiniAppRecruitmentService {
  constructor(
    private readonly recruitmentRequirementRepository: RecruitmentRequirementRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly notificationService: NotificationService,
    private readonly professionalFieldRepository: ProfessionalFieldRepository,
    private readonly jobTypeRepository: JobTypeRepository,
    private readonly dfProvinceRepository: DFProvinceRepository,
    private readonly yearOfExperienceRepository: YearOfExperienceRepository,
    private readonly genderRepository: GenderRepository,
    private readonly ageGroupRepository: AgeGroupRepository,
    private readonly salaryRangeRepository: SalaryRangeRepository,
    private readonly recruitmentJobTypeRepository: RecruitmentJobTypeRepository,
    private readonly feeOfRecruitmentRequirementRepository: FeeOfRecruitmentRequirementRepository,
    private readonly recruitmentRequirementHistoryRepository: RecruitmentRequirementHistoryRepository,
    private readonly recruitmentRequirementProvinceRepository: RecruitmentRequirementProvinceRepository,
    private readonly candidateInterviewRepository: CandidateInterviewRepository,
    private readonly candidateRecruitmentRepository: CandidateRecruitmentRepository,
    private readonly recruitmentRequirementImplementationRepository: RecruitmentRequirementImplementationRepository,
    private readonly recruitmentRequirementFileRepository: RecruitmentRequirementFileRepository,
    private readonly recruitmentRequirementHroRepository: RecruitmentRequirementHroRepository,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly sequelize: Sequelize,
    private readonly walletRepository: WalletRepository,
    private readonly walletHistoryRepository: WalletHistoryRepository,
    private readonly enterPriseAddressRepository: EnterPriseAddressRepository,
    private readonly dfCareerRepository: DFCareerRepository,
    private readonly userRecruitmentFavoriteRepository: UserRecruitmentFavoriteRepository,
    private readonly positionRepository: PositionRepository,
    private readonly candidateInformationRepository: CandidateInformationRepository,
    private readonly candidateApplyRepository: CandidateApplyRepository,
    private readonly candidateApplyFileRepository: CandidateApplyFileRepository,
    private readonly userPointRepository: UserPointRepository,
    private readonly configPointHroRepository: ConfigPointHroRepository,
    private readonly userPointHistoryRepository: UserPointHistoryRepository,
  ) {}

  async create(user_id: number, dto: HROCreateRecruitmentWithEnterperiseDto) {
    //Check giá trị tạo công ty/doanh nghiệp
    if (dto.enterprise) {
      const phoneNumber = await this.userRepository.foundPhoneNumberEnterprise(
        dto.enterprise.phone_number,
      );
      if (phoneNumber) {
        throw new HttpException(
          'Số điện thoại đã được đăng ký làm doanh nghiệp. Vui lòng đăng ký bằng số điện thoại khác!',
          HttpStatus.FOUND,
        );
      }

      const phoneNumberCandidate =
        await this.userRepository.foundPhoneNumberCandidate(
          dto.enterprise.phone_number,
        );

      if (phoneNumberCandidate) {
        throw new HttpException(
          'Số điện thoại đã được đăng ký trở thành ứng viên. Vui lòng đăng ký bằng số điện thoại khác!',
          HttpStatus.FOUND,
        );
      }

      const foundEmail = await this.userRepository.foundEmail(
        dto.enterprise.email,
      );

      if (foundEmail) {
        throw new HttpException(
          'Email đã tồn tại trên hệ thống',
          HttpStatus.FOUND,
        );
      }

      if (dto?.enterprise?.tax_code) {
        const foundTaxCode = await this.enterpriseRepository.findOne({
          where: {
            tax_code: dto?.enterprise?.tax_code,
          },
        });

        if (foundTaxCode) {
          throw new HttpException(
            'Mã số thuế đã tồn tại trên hệ thống',
            HttpStatus.FOUND,
          );
        }
      }
    }
    //Check giá trị tạo job
    if (dto?.recruitment?.position_id) {
      const foundPosition = await this.positionRepository.findOne({
        where: {
          id: dto?.recruitment?.position_id,
        },
      });

      if (!foundPosition) {
        throw new HttpException(
          'Vị trí tuyển dụng không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto?.recruitment?.is_all_province == IS_ACTIVE.ACTIVE) {
      if (
        dto?.recruitment?.df_province &&
        dto?.recruitment?.df_province.length > 0
      ) {
        throw new HttpException(
          'Vui lòng không chọn khu vực làm việc ',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (
      dto?.recruitment?.df_province &&
      dto?.recruitment?.df_province.length > 0
    ) {
      const province = await this.dfProvinceRepository.findAll({
        where: {
          id: { [Op.in]: dto?.recruitment?.df_province },
        },
      });

      if (province?.length != dto?.recruitment?.df_province.length) {
        throw new HttpException(
          'Khu vực làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    let salaryRange: null | SalaryRange = null;

    if (dto?.recruitment?.salary_range) {
      salaryRange = await this.salaryRangeRepository.findSalaryRange(
        dto?.recruitment?.salary_range,
      );

      if (!salaryRange) {
        throw new HttpException(
          'Mức lương không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (
      dto?.recruitment?.salary_range &&
      dto?.recruitment?.salary_range_input
    ) {
      throw new HttpException(
        'Mức lương không thế tuỳ chọn thêm',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (dto?.recruitment?.career_field_id) {
      const foundCareer = await this.dfCareerRepository.findOne({
        where: {
          id: dto?.recruitment?.career_field_id,
        },
      });

      if (!foundCareer) {
        throw new HttpException(
          'Nghề nghiệp không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        // Tạo dữ liệu công ty/doanh nghiệp
        let enterprise: any;
        if (dto.enterprise) {
          const payloadCreateUser: any = {
            full_name: dto.enterprise?.manager || null,
            email: dto.enterprise.email,
            phone_number: dto.enterprise.phone_number,
            // alternate_phone: dto?.alternate_phone || null,
            verify_password: dto.enterprise?.password || DEFAULT_PASSWORD,
            created_by: user_id,
          };

          const user = await this.userRepository.createEnterpriseAdmin(
            payloadCreateUser,
            ROLE.ENTERPRISE,
            transaction,
          );

          const payloadCreateEnterprise: any = {
            position: dto.enterprise?.position || null,
            name: dto.enterprise?.enterprise_name,
            tax_code: dto.enterprise?.tax_code || null,
            logo: dto.enterprise?.logo,
            status: IS_ACTIVE.ACTIVE,
            user_id: user.id,
            manager: user.full_name,
            created_by: user_id,
          };

          enterprise = await this.enterpriseRepository.create(
            payloadCreateEnterprise,
            { transaction },
          );
          //Cập nhật thông tin người đại diện thuộc công ty
          await this.userRepository.update(
            {
              enterprise_id: enterprise.id,
            },
            {
              where: {
                id: user.id,
              },
              transaction,
            },
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

          await this.enterPriseAddressRepository.create(
            {
              enterprise_id: enterprise.id,
              df_province_id: dto.enterprise?.province || null,
              df_district_id: dto.enterprise?.district || null,
              df_ward_id: dto.enterprise?.ward || null,
              name: dto.enterprise?.address,
              address: dto.enterprise?.address,
            },
            { transaction },
          );

          //Cập nhật thông tin HR thuộc công ty
          await this.userRepository.update(
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
        }

        if (!enterprise) {
          const user = await this.userRepository.findOne({
            where: {
              id: user_id,
            },
          });

          enterprise = await this.enterpriseRepository.findOne({
            where: {
              id: user?.enterprise_id,
            },
          });
        }

        //Tạo job/tin tuyển dụng
        if (dto.recruitment) {
          let status = dto?.recruitment.status || RECRUITMENT_STATUS.PROCESSED;
          if (dto.is_just_jd) {
            status = RECRUITMENT_STATUS.PENDING;
          }
          const payloadCreate = {
            position_id: dto.recruitment.position_id || null,
            position_input: dto.recruitment.position_input || null,
            professional_field_id:
              dto.recruitment.professional_field_id || null,
            enterprise_id: +enterprise.id,
            salary_range_id: salaryRange ? dto.recruitment.salary_range : null,
            job_description: dto.recruitment.job_description || null,
            enterprise_introduction:
              dto.recruitment.enterprise_introduction || null,
            benefits_and_treatment:
              dto.recruitment.benefits_and_treatment || null,
            status,
            created_by: user_id,
            is_all_province: dto.recruitment.is_all_province,
            professional_field_input:
              dto.recruitment.professional_field_input || null,
            created_on_mini_app: 1,
            apply_deadline: dto.recruitment.apply_deadline,
            career_id: dto.recruitment.career_field_id || null,
            recruitment_count: dto.recruitment.recruitment_count,
            work_address: dto.recruitment.work_address || null,
            modify_date_processed:
              status === RECRUITMENT_STATUS.PROCESSED ? new Date() : null,
            years_of_experience_id:
              +dto.recruitment.years_of_experience || null,
          };

          const recruitment =
            await this.recruitmentRequirementRepository.createRecruitment(
              payloadCreate,
              transaction,
            );
          if (dto.recruitment.jd && dto.recruitment.jd.length > 0) {
            const dataCreated = dto.recruitment.jd.map((e) => ({
              recruitment_requirement_id: recruitment.id,
              file: e.file,
              file_name: e.file_name,
            }));
            await this.recruitmentRequirementFileRepository.bulkCreate(
              dataCreated,
              { transaction },
            );
          }
          if (
            dto.recruitment.df_province &&
            dto.recruitment.df_province.length > 0
          ) {
            const created = dto.recruitment.df_province.map((e) => ({
              recruitment_requirement_id: recruitment.id,
              df_province_id: e,
            }));
            await this.recruitmentRequirementProvinceRepository.bulkCreate(
              created,
              { transaction },
            );
          }

          await this.recruitmentRequirementHistoryRepository.create(
            {
              recruitment_requirement_id: recruitment.id,
              status: RECRUITMENT_STATUS.PROCESSED,
              created_by: user_id,
            },
            { transaction },
          );

          //Cộng điểm cho HR
          if (recruitment?.status === RECRUITMENT_STATUS.PROCESSED) {
            let foundUserPoint: any = await this.userPointRepository.findOne({
              where: { user_id },
            });
            if (!foundUserPoint) {
              const userPoint = await this.userPointRepository.create(
                {
                  user_id,
                  point: 0,
                },
                { transaction },
              );

              //* Không khởi tạo lịch sử điểm = 0 ban đầu
              // await this.userPointHistoryRepository.create(
              //   {
              //     user_point_id: userPoint?.id,
              //     type: WALLET_TYPE.ADD,
              //     mutable_type: WALLET_MUTABLE_TYPE.ADD_UPDATE,
              //     value: 0,
              //     current_point: 0,
              //   },
              //   { transaction },
              // );
              foundUserPoint = userPoint;
            }
            const foundConfigPoint: any =
              await this.configPointHroRepository.findAll();

            await this.userPointRepository.update(
              {
                point:
                  Number(foundUserPoint.point) +
                  Number(foundConfigPoint[0].point),
              },
              {
                where: { user_id },
                transaction,
              },
            );
            //Tạo lịch sử tích luỹ điểm
            await this.userPointHistoryRepository.create(
              {
                user_point_id: foundUserPoint.id,
                type: POINT_TYPE.ADD,
                value: foundConfigPoint[0].point,
                current_point:
                  Number(foundUserPoint.point) +
                  Number(foundConfigPoint[0].point),
                mutable_type: POINT_MUTABLE_TYPE.ADD_CV,
                created_by: user_id,
                // note: dto.note || null,
              },
              { transaction },
            );

            //Gửi tin nhắn zalo tới HR (người đã tạo tin tuyển dụng)
            const foundHRO = await this.userRepository.findOne({
              where: {
                id: user_id,
                role_id: ROLE.HRO,
              },
            });
            if (foundHRO && foundHRO?.phone_number) {
              const message = adminApprovesRecruitmentTemplate(
                foundHRO.full_name,
                recruitment.position_input,
                `https://zalo.me/s/1312390836269348201/detailjob/${recruitment.id}?type=2`,
                foundConfigPoint[0].point,
                'https://zalo.me/s/1312390836269348201/historypoint?type=3',
              );
              await sendZaloMessage({
                messages: [
                  {
                    phone: foundHRO?.phone_number,
                    name: foundHRO?.full_name,
                    message: message,
                  },
                ],
              });
            }
          }

          const code = generateUniqueWEPKey();

          await recruitment?.update({ code }, { transaction });

          await recruitment?.save();

          return recruitment;
        }
        return enterprise;
      },
    );

    return sendSuccess({ data: result });
  }

  async findAllForHRO(user_id: number, dto: MiniAppFilterRecruitmentByHRODto) {
    const foundUser = await this.userRepository.findByPk(user_id);
    if (!foundUser) {
      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const foundEnterprise = await this.enterpriseRepository.findOne({
      where: {
        id: foundUser.enterprise_id,
      },
    }); // TÌm người đại diện cty

    if (!foundUser) {
      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const whereCondition: any = {
      [Op.and]: [
        {
          created_by: {
            [Op.or]: [user_id, foundEnterprise?.user_id],
          },
        },
      ],
    };
    if (
      !dto.status?.split(',').includes(RECRUITMENT_STATUS.REJECTED.toString())
    ) {
      whereCondition[Op.and].push({
        status: {
          [Op.notIn]: [RECRUITMENT_STATUS.REJECTED],
        },
      });
    }

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }

    if (dto.apply_deadline_from_date || dto.apply_deadline_to_date) {
      const { fromDate, toDate } = convertDateTime(
        dto.apply_deadline_from_date,
        dto.apply_deadline_to_date,
      );
      whereCondition.apply_deadline = { [Op.between]: [fromDate, toDate] };
    }

    if (dto.status) {
      let statusArr = dto.status.split(',');
      const today = moment().startOf('day').toDate();
      if (!statusArr.includes(RECRUITMENT_STATUS.OVERDUE.toString())) {
        whereCondition.apply_deadline = {
          [Op.or]: [
            {
              [Op.gte]: today, // Nếu k lọc các tin đã quá hạn thì mặc định lấy các tin chưa quá hạn
            },
            {
              [Op.eq]: null,
            },
          ],
        };
        statusArr = statusArr.filter(
          (elm) => elm !== RECRUITMENT_STATUS.OVERDUE.toString(),
        );

        if (statusArr?.length > 0) {
          whereCondition.status = { [Op.in]: statusArr };
        }
      } else {
        statusArr = statusArr.filter(
          (elm) => elm !== RECRUITMENT_STATUS.OVERDUE.toString(),
        );

        whereCondition[Op.and].push({
          [Op.or]: [
            {
              apply_deadline: {
                [Op.lt]: today, // TH lọc các tin đã quá hạn
              },
            },
            {
              status: { [Op.in]: statusArr },
            },
          ],
        });
      }
    }

    if (dto.search) {
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            position_input: { [Op.like]: `%${dto.search}%` },
          },
        ],
      });
    }

    if (dto.career_ids) {
      const careerIdsArray: any = dto.career_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            career_id: { [Op.in]: careerIdsArray },
          },
        ],
      });
    }

    const includeCountOptions: any = [
      {
        model: Enterprise,
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'status', 'avatar'],
            as: 'user',
          },
        ],
      },
    ];
    const includeOptions: any = [
      {
        model: Enterprise,
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'status', 'avatar'],
            as: 'user',
          },
          {
            model: EnterpriseAddress,
            attributes: [
              'id',
              'df_province_id',
              'df_district_id',
              'df_ward_id',
              'address',
              'name',
            ],
            include: {
              model: DFProvince,
              attributes: ['id', 'name'],
            },
          },
        ],
      },
      {
        model: ProfessionalField,
      },
      {
        model: Position,
      },
      {
        model: CandidateRecruitment,
        include: [
          {
            model: CandidateInformation,
            as: 'candidate_information',
            include: [{ model: User }],
          },
        ],
      },
      { model: RecruitmentRequirementFile },
      { model: SalaryRange },
    ];

    let provinceDataInclude: any = {
      model: RecruitmentRequirementProvince,
      as: 'recruitment_requirement_province',
      include: {
        model: DFProvince,
        attributes: ['id', 'name'],
      },
    };

    if (dto.province_ids) {
      const provinceIdsArray: any = dto.province_ids
        .split(',')
        .map((id) => parseInt(id));
      const conditionProvince = {
        '$recruitment_requirement_province.df_province_id$': {
          [Op.in]: provinceIdsArray,
        },
      };
      provinceDataInclude = {
        model: RecruitmentRequirementProvince,
        as: 'recruitment_requirement_province',
        where: conditionProvince,
      };
    }
    includeCountOptions.push(provinceDataInclude);
    includeOptions.push(provinceDataInclude);

    const options: any = {
      where: whereCondition,
      attributes: {
        include: [],
      },
      include: includeOptions,
      order: ['status', ['updated_at', 'DESC']],
    };
    const countOptions: any = {
      where: whereCondition,
      distinct: true,
      // include: includeCountOptions,
    };

    dto.province_ids ? (countOptions.include = includeCountOptions) : '';

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

    const recruitments: any =
      await this.recruitmentRequirementRepository.findAll(options);
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };

    // Tính tổng các cv đã apply
    const foundCandidateRecruitments =
      await this.candidateRecruitmentRepository.findAll({
        where: {
          recruitment_requirement_id: {
            [Op.in]: recruitments?.map((elm: any) => elm?.id),
          },
        },
        attributes: [
          'id',
          'candidate_information_id',
          'recruitment_requirement_id',
        ],
      });

    for (const recruitment of recruitments) {
      recruitment.dataValues.total_applied = foundCandidateRecruitments?.filter(
        (elm) => elm?.recruitment_requirement_id === recruitment?.id,
      ).length;
    }

    return sendSuccess({
      data: recruitments,
      blocks: {
        status: RECRUITMENT_STATUS,
      },
      paging,
    });
  }

  async findAllForCandidate(
    user_id: number,
    dto: MiniAppFilterRecruitmentByCandidateDto,
    url: string,
  ) {
    // Tìm các tin tuyển dụng đã yêu thích
    const favoriteRecruitment =
      await this.userRecruitmentFavoriteRepository.findAll({
        where: {
          user_id,
        },
      });
    const favoriteRecruitmentIds = favoriteRecruitment?.map(
      (elm) => elm.recruitment_requirement_id,
    );
    // return favoriteRecruitmentIds;
    const today = moment().startOf('day').toDate();
    const whereCondition: any = {
      [Op.and]: [
        {
          status: {
            [Op.in]: [RECRUITMENT_STATUS.PROCESSED],
            [Op.notIn]: [RECRUITMENT_STATUS.REJECTED, RECRUITMENT_STATUS.DRAFT],
          },
          [Op.or]: [
            {
              apply_deadline: {
                [Op.gte]: today,
              },
            },
            {
              apply_deadline: null,
            },
          ],
        },
      ],
    };

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }

    if (dto.search) {
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            position_input: { [Op.like]: `%${dto.search}%` },
          },
        ],
      });
    }

    if (dto.candidate_recruitment_ids) {
      const foundCandidateInformation = await CandidateInformation.findOne({
        where: {
          user_id,
        },
      });

      const statusArray: any = dto.candidate_recruitment_ids
        ?.split(',')
        .map((id) => parseInt(id));

      const foundCandidateRecruiments = await CandidateRecruitment.findAll({
        where: {
          status: {
            [Op.in]: statusArray,
          },
          candidate_information_id: foundCandidateInformation?.id,
        },
      });

      const idsArray: any = foundCandidateRecruiments.map((elm) => elm?.id);

      whereCondition[Op.and].push({
        [Op.or]: [
          {
            id: { [Op.in]: idsArray },
          },
        ],
      });
    }

    if (dto.career_ids) {
      const careerIdsArray: any = dto.career_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            career_id: { [Op.in]: careerIdsArray },
          },
        ],
      });
      // whereCondition.career_id = { [Op.in]: careerIdsArray };
    }

    if (dto.years_of_experience_ids) {
      const yearsOfExperienceIdsArray: any = dto.years_of_experience_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            years_of_experience_id: { [Op.in]: yearsOfExperienceIdsArray },
          },
        ],
      });
    }

    if (dto.professional_field_ids) {
      const professionalFieldIds: any = dto.professional_field_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            professional_field_id: { [Op.in]: professionalFieldIds },
          },
        ],
      });
    }

    if (dto.position_ids) {
      const positionIds: any = dto.position_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            position_id: { [Op.in]: positionIds },
          },
        ],
      });
    }

    if (dto.salary_range_ids) {
      const salaryRangeIds: any = dto.salary_range_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            salary_range_id: { [Op.in]: salaryRangeIds },
          },
        ],
      });
    }

    const includeCountOptions: any = [
      {
        model: Enterprise,
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'status', 'avatar'],
            as: 'user',
          },
        ],
      },
    ];
    const includeOptions: any = [
      {
        model: Enterprise,
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'status', 'avatar'],
            as: 'user',
          },
          {
            model: EnterpriseAddress,
            attributes: [
              'id',
              'df_province_id',
              'df_district_id',
              'df_ward_id',
              'address',
              'name',
            ],
            include: {
              model: DFProvince,
              attributes: ['id', 'name'],
            },
          },
        ],
      },
      {
        model: ProfessionalField,
      },
      {
        model: Position,
      },
      {
        model: CandidateRecruitment,
        include: [
          {
            model: CandidateInformation,
            as: 'candidate_information',
            include: [{ model: User }],
          },
        ],
      },
      { model: RecruitmentRequirementFile },
      { model: SalaryRange },
      { model: FeeOfRecruitmentRequirement, include: [{ model: FeeType }] },
    ];

    let provinceDataInclude: any = {
      model: RecruitmentRequirementProvince,
      as: 'recruitment_requirement_province',
      include: {
        model: DFProvince,
        attributes: ['id', 'name'],
      },
    };

    if (dto.province_ids) {
      const provinceIdsArray: any = dto.province_ids
        .split(',')
        .map((id) => parseInt(id));
      const conditionProvince = {
        '$recruitment_requirement_province.df_province_id$': {
          [Op.in]: provinceIdsArray,
        },
      };
      provinceDataInclude = {
        model: RecruitmentRequirementProvince,
        as: 'recruitment_requirement_province',
        where: conditionProvince,
      };
    }
    includeCountOptions.push(provinceDataInclude);
    includeOptions.push(provinceDataInclude);

    const options: any = {
      where: whereCondition,
      attributes: {
        include: [],
      },
      include: includeOptions,
      order: ['status', ['created_at', 'DESC']],
    };
    const countOptions: any = {
      where: whereCondition,
      distinct: true,
      // col: 'RecruitmentRequirement.id',
    };

    dto.province_ids ? (countOptions.include = includeCountOptions) : '';

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

    const recruitments: any =
      await this.recruitmentRequirementRepository.findAll(options);

    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };

    // Tìm các tin tuyển dụng đã apply
    const foundCandidateInformation: any =
      await this.candidateInformationRepository.findOne({
        where: {
          user_id,
        },
        attributes: ['id', 'user_id'],
      });

    const foundApplyRecruitments =
      await this.candidateRecruitmentRepository.findAll({
        where: {
          candidate_information_id: foundCandidateInformation?.id,
        },
        attributes: [
          'id',
          'candidate_information_id',
          'recruitment_requirement_id',
        ],
      });
    const applyRecruitmentsIds = foundApplyRecruitments?.map(
      (elm) => elm.recruitment_requirement_id,
    );

    //Maping các tin đã thích + các tin tuyển dụng đã ứng tuyển (đối với ứng viên/cộng tác viên)
    for (const recruitment of recruitments) {
      if (favoriteRecruitmentIds?.includes(recruitment.id)) {
        recruitment.dataValues.is_favorite = true;
      }
      if (applyRecruitmentsIds?.includes(recruitment.id)) {
        recruitment.dataValues.is_applied = true;
      } else {
        recruitment.dataValues.is_applied = false;
      }
    }

    //Lưu thông tin tìm kiếm
    if (dto?.is_save === 'true') {
      await saveSearchingData(user_id, url, dto, foundCandidateInformation.id);
    }

    return sendSuccess({
      data: recruitments,
      blocks: {
        status: RECRUITMENT_STATUS,
      },
      paging,
    });
  }

  async findAll(dto: MiniAppFilterRecruitmentByCandidateDto) {
    const today = moment().startOf('day').toDate();
    const whereCondition: any = {
      [Op.and]: [
        {
          status: {
            [Op.in]: [RECRUITMENT_STATUS.PROCESSED],
            [Op.notIn]: [RECRUITMENT_STATUS.REJECTED, RECRUITMENT_STATUS.DRAFT],
          },
        },
        {
          [Op.or]: [
            {
              apply_deadline: {
                [Op.gte]: today,
              },
            },
            {
              apply_deadline: null,
            },
          ],
        },
      ],
    };

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }

    if (dto.search) {
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            position_input: { [Op.like]: `%${dto.search}%` },
          },
        ],
      });
    }

    if (dto.career_ids) {
      const careerIdsArray: any = dto.career_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            career_id: { [Op.in]: careerIdsArray },
          },
        ],
      });
      // whereCondition.career_id = { [Op.in]: careerIdsArray };
    }

    if (dto.years_of_experience_ids) {
      const yearsOfExperienceIdsArray: any = dto.years_of_experience_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            years_of_experience_id: { [Op.in]: yearsOfExperienceIdsArray },
          },
        ],
      });
    }

    if (dto.professional_field_ids) {
      const professionalFieldIds: any = dto.professional_field_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            professional_field_id: { [Op.in]: professionalFieldIds },
          },
        ],
      });
    }

    if (dto.position_ids) {
      const positionIds: any = dto.position_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            position_id: { [Op.in]: positionIds },
          },
        ],
      });
    }

    if (dto.salary_range_ids) {
      const salaryRangeIds: any = dto.salary_range_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            salary_range_id: { [Op.in]: salaryRangeIds },
          },
        ],
      });
    }

    const includeCountOptions: any = [
      {
        model: Enterprise,
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'status', 'avatar'],
            as: 'user',
          },
        ],
      },
    ];
    const includeOptions: any = [
      {
        model: Enterprise,
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'status', 'avatar'],
            as: 'user',
          },
          {
            model: EnterpriseAddress,
            attributes: [
              'id',
              'df_province_id',
              'df_district_id',
              'df_ward_id',
              'address',
              'name',
            ],
            include: {
              model: DFProvince,
              attributes: ['id', 'name'],
            },
          },
        ],
      },
      {
        model: ProfessionalField,
      },
      {
        model: Position,
      },
      {
        model: CandidateRecruitment,
        include: [
          {
            model: CandidateInformation,
            as: 'candidate_information',
            include: [{ model: User }],
          },
        ],
      },
      { model: RecruitmentRequirementFile },
      { model: SalaryRange },
    ];

    let provinceDataInclude: any = {
      model: RecruitmentRequirementProvince,
      as: 'recruitment_requirement_province',
      include: {
        model: DFProvince,
        attributes: ['id', 'name'],
      },
    };

    if (dto.province_ids) {
      const provinceIdsArray: any = dto.province_ids
        .split(',')
        .map((id) => parseInt(id));
      const conditionProvince = {
        '$recruitment_requirement_province.df_province_id$': {
          [Op.in]: provinceIdsArray,
        },
      };
      provinceDataInclude = {
        model: RecruitmentRequirementProvince,
        as: 'recruitment_requirement_province',
        where: conditionProvince,
      };
    }
    includeCountOptions.push(provinceDataInclude);
    includeOptions.push(provinceDataInclude);

    const options: any = {
      where: whereCondition,
      attributes: {
        include: [],
      },
      include: includeOptions,
      order: ['status', ['updated_at', 'DESC']],
    };
    const countOptions: any = {
      where: whereCondition,
      distinct: true,
      // include: includeCountOptions,
    };

    dto.province_ids ? (countOptions.include = includeCountOptions) : '';

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
    return sendSuccess({
      data: recruitment,
      blocks: {
        status: RECRUITMENT_STATUS,
      },
      paging,
    });
  }

  async detail(id: number, candidate_information_id?: number) {
    const recruitment: any =
      await this.recruitmentRequirementRepository.findOne({
        where: {
          id,
        },
        include: [
          { model: ProfessionalField },
          { model: Position },
          { model: RecruitmentRequirementFile },
          {
            model: Enterprise,
            include: [
              { model: User, as: 'user' },
              {
                model: EnterpriseAddress,
                include: [
                  {
                    model: DFProvince,
                  },
                  {
                    model: DFWard,
                  },
                  {
                    model: DFDistrict,
                  },
                ],
              },
            ],
          },
          {
            model: RecruitmentRequirementProvince,
            include: [{ model: DFProvince }],
          },
          { model: SalaryRange },
          { model: YearOfExperience },
          { model: AgeGroup },
          { model: FeeOfRecruitmentRequirement, include: [{ model: FeeType }] },
          {
            model: CandidateRecruitment,
            include: [
              {
                model: CandidateInformation,
                as: 'candidate_information',
                include: [{ model: User }],
              },
              {
                model: User,
                attributes: [
                  'avatar',
                  'role_id',
                  'full_name',
                  'email',
                  'phone_number',
                ],
              },
            ],
          },
          {
            model: RecruitmentRequirementHistory,
            attributes: {
              include: [
                [
                  Sequelize.literal(
                    `(
                  SELECT JSON_OBJECT('full_name',full_name,'phone_number', phone_number) FROM candidate_information JOIN user ON user.id = candidate_information.user_id
                  WHERE candidate_information.id = recruitment_requirement_history.candidate_information_id
                  LIMIT 1
                )`,
                  ),
                  'candidate_information',
                ],
              ],
            },
            include: [
              {
                model: User,
                attributes: [
                  'id',
                  'full_name',
                  'role_id',
                  'avatar',
                  'phone_number',
                  [
                    Sequelize.literal(
                      `(
                      SELECT name FROM enterprise
                      WHERE user_id = recruitment_requirement_history.created_by
                      LIMIT 1
                     )`,
                    ),
                    'enterprise_name',
                  ],
                ],
              },
            ],
          },
          {
            model: RecruitmentJobType,
            attributes: {
              include: [
                [
                  Sequelize.literal(
                    `(
                    SELECT name FROM job_type
                    WHERE id = recruitment_job_type.job_type_id
                    LIMIT 1
                   )`,
                  ),
                  'job_type_name',
                ],
              ],
            },
          },
          { model: User, attributes: ['id', 'full_name'] },
          {
            model: RecruitmentRequirementImplementation,
            attributes: {
              include: [
                [
                  Sequelize.literal(
                    `(
                    SELECT COUNT(id) FROM candidate_recruitment
                    WHERE deleted_at IS NULL AND created_by = recruitment_requirement_implementation.user_id
                    AND recruitment_requirement_id = ${id}
                    LIMIT 1
                   )`,
                  ),
                  'candidate_count',
                ],
              ],
            },
            include: [
              {
                model: User,
                attributes: ['id', 'full_name', 'phone_number', 'email'],
              },
            ],
          },
          {
            model: RecruitmentRequirementHro,
            include: [{ model: User, attributes: ['id', 'full_name'] }],
            attributes: {
              include: [
                [
                  Sequelize.literal(
                    `(
                    SELECT IF(COUNT(candidate_recruitment.id)>0,1,0) FROM candidate_recruitment 
                    JOIN candidate_information ON candidate_information.id = candidate_recruitment.candidate_information_id
                    WHERE recruitment_requirement_id = ${id} AND candidate_information.created_by = recruitment_requirement_hro.user_id
                    AND candidate_recruitment.deleted_at IS NULL
                    LIMIT 1
                   )`,
                  ),
                  'has_candidate',
                ],
              ],
            },
          },
        ],
        attributes: {
          include: [
            [
              this.sequelize.literal(
                `(
            SELECT COUNT(id) FROM candidate_recruitment
            WHERE recruitment_requirement_id = ${id}
            LIMIT 1
           )`,
              ),
              'candidate_count',
            ],
          ],
        },
      });

    if (candidate_information_id) {
      const foundCandidateRequirement =
        await this.candidateRecruitmentRepository.findAll({
          where: {
            candidate_information_id,
            recruitment_requirement_id: recruitment?.id,
            status: {
              [Op.ne]: CANDIDATE_RECRUITMENT_STATUS.PENDING_CV,
            },
          },
        });

      let files_applied: any = null;

      if (foundCandidateRequirement) {
        const foundCandidateApply = await this.candidateApplyRepository.findAll(
          {
            where: {
              candidate_information_id,
              candidate_recruitment_id: foundCandidateRequirement?.map(
                (elm) => elm.id,
              ),
            },
            include: [
              {
                model: CandidateApplyFile,
              },
            ],
          },
        );
        files_applied = foundCandidateApply?.flatMap(
          (elm) => elm?.candidate_apply_file,
        );
      }
      recruitment.dataValues.cv_files_applied = files_applied;
    }

    return sendSuccess({
      data: recruitment,
      blocks: {
        status: RECRUITMENT_STATUS,
      },
    });
  }

  async update(user_id: number, dto: HROUpdateRecruitmentWithEnterperiseDto) {
    const foundRecruitment =
      await this.recruitmentRequirementRepository.findOne({
        where: {
          id: dto.recruitment_requirement_id,
          created_by: user_id,
        },
      });
    if (!foundRecruitment) {
      throw new HttpException(
        'Tin tuyển dụng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const foundEnterprise = await this.enterpriseRepository.findOne({
      where: {
        id: foundRecruitment.enterprise_id,
      },
    });
    if (!foundEnterprise) {
      throw new HttpException(
        'Công ty doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const phoneNumberOfEnterpriseRecent = await this.userRepository.findOne({
      where: {
        phone_number: dto.enterprise.phone_number,
        role_id: ROLE.ENTERPRISE,
      },
    });
    //Check giá trị cập nhật công ty/doanh nghiệp (điều kiện nếu tồn tại một sđt của user khác công ty -> reject)
    const phoneNumber = await this.userRepository.findOne({
      where: {
        phone_number: dto.enterprise.phone_number,
        enterprise_id: {
          [Op.ne]: foundEnterprise.id,
        },
      },
    });

    if (phoneNumber) {
      throw new HttpException(
        'Số điện thoại đã được đăng ký .Vui lòng đăng ký bằng số điện thoại khác!',
        HttpStatus.FOUND,
      );
    }

    const foundEmail = await this.userRepository.findOne({
      where: {
        email: dto.enterprise.email,
        id: {
          [Op.ne]: foundEnterprise.user_id,
        },
      },
    });

    if (foundEmail) {
      throw new HttpException(
        'Email đã tồn tại trên hệ thống',
        HttpStatus.FOUND,
      );
    }

    if (dto?.enterprise?.tax_code) {
      const foundTaxCode = await this.enterpriseRepository.findOne({
        where: {
          tax_code: dto?.enterprise?.tax_code,
          user_id: {
            [Op.ne]: foundEnterprise.user_id,
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

    //Check giá trị tạo job
    if (dto?.recruitment?.position_id) {
      const foundPosition = await this.positionRepository.findAll({
        where: {
          id: dto?.recruitment?.position_id,
        },
      });

      if (!foundPosition) {
        throw new HttpException(
          'Vị trí tuyển dụng không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto?.recruitment?.is_all_province == IS_ACTIVE.ACTIVE) {
      if (
        dto?.recruitment?.df_province &&
        dto?.recruitment?.df_province.length > 0
      ) {
        throw new HttpException(
          'Vui lòng không chọn khu vực làm việc ',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (
      dto?.recruitment?.df_province &&
      dto?.recruitment?.df_province.length > 0
    ) {
      const province = await this.dfProvinceRepository.findAll({
        where: {
          id: { [Op.in]: dto?.recruitment?.df_province },
        },
      });

      if (province?.length != dto?.recruitment?.df_province.length) {
        throw new HttpException(
          'Khu vực làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    let salaryRange: null | SalaryRange = null;

    if (dto?.recruitment?.salary_range) {
      salaryRange = await this.salaryRangeRepository.findSalaryRange(
        dto?.recruitment?.salary_range,
      );

      if (!salaryRange) {
        throw new HttpException(
          'Mức lương không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (
      dto?.recruitment?.salary_range &&
      dto?.recruitment?.salary_range_input
    ) {
      throw new HttpException(
        'Mức lương không thế tuỳ chọn thêm',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (dto?.recruitment?.career_field_id) {
      const foundCareer = await this.dfCareerRepository.findOne({
        where: {
          id: dto?.recruitment?.career_field_id,
        },
      });

      if (!foundCareer) {
        throw new HttpException(
          'Nghề nghiệp không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      // cập nhật dữ liệu công ty/doanh nghiệp
      const payloadUpdateUser: any = {
        full_name: dto.enterprise?.manager || null,
        email: dto.enterprise.email,
        phone_number: dto.enterprise.phone_number,
      };

      const user = await this.userRepository.update(payloadUpdateUser, {
        where: {
          id: foundEnterprise.user_id,
        },
        transaction,
      });

      const payloadUpdateEnterprise: any = {
        position: dto.enterprise?.position || null,
        name: dto.enterprise?.enterprise_name,
        tax_code: dto.enterprise?.tax_code || null,
        logo: dto.enterprise?.logo,
        status: IS_ACTIVE.ACTIVE,
        manager: user.full_name,
      };

      await this.enterpriseRepository.update(payloadUpdateEnterprise, {
        where: {
          id: foundEnterprise.id,
        },
        transaction,
      });

      // Xoá địa chỉ công ty cũ
      await this.enterPriseAddressRepository.update(
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

      await this.enterPriseAddressRepository.create(
        {
          enterprise_id: foundEnterprise.id,
          df_province_id: dto.enterprise?.province || null,
          df_district_id: dto.enterprise?.district || null,
          df_ward_id: dto.enterprise?.ward || null,
          name: dto.enterprise?.address,
          address: dto.enterprise?.address,
        },
        { transaction },
      );

      //Tạo job/tin tuyển dụng
      if (dto.recruitment) {
        const payloadUpdate = {
          professional_field_id: dto.recruitment.professional_field_id || null,
          position_id: dto.recruitment.position_id || null,
          position_input: dto.recruitment.position_input || null,
          salary_range_id: salaryRange ? dto.recruitment.salary_range : null,
          job_description: dto.recruitment.job_description || null,
          enterprise_introduction:
            dto.recruitment.enterprise_introduction || null,
          benefits_and_treatment:
            dto.recruitment.benefits_and_treatment || null,
          is_all_province: dto.recruitment.is_all_province,
          professional_field_input:
            dto.recruitment.professional_field_input || null,
          apply_deadline: dto.recruitment.apply_deadline,
          career_id: dto.recruitment.career_field_id || null,
          recruitment_count: dto.recruitment.recruitment_count,
          // status: dto.recruitment.status || foundRecruitment.status,
          work_address: dto.recruitment.work_address || null,
          years_of_experience_id: +dto.recruitment.years_of_experience || null,
        };
        await this.recruitmentRequirementRepository.update(payloadUpdate, {
          where: {
            id: Number(dto.recruitment_requirement_id),
          },
          transaction,
        });

        if (dto.recruitment.jd && dto.recruitment.jd.length > 0) {
          const dataCreated = dto.recruitment.jd.map((e) => ({
            recruitment_requirement_id: dto.recruitment_requirement_id,
            file: e.file,
            file_name: e.file_name,
          }));
          await this.recruitmentRequirementFileRepository.bulkCreate(
            dataCreated,
            { transaction },
          );
          //Xoá các jd cũ
          await this.recruitmentRequirementFileRepository.update(
            {
              deleted_at: new Date(),
            },
            {
              where: {
                recruitment_requirement_id: dto.recruitment_requirement_id,
              },
              transaction,
            },
          );
        }

        if (
          dto.recruitment.df_province &&
          dto.recruitment.df_province.length > 0
        ) {
          //Xoá các địa chỉ tỉnh tp cũ
          await this.recruitmentRequirementProvinceRepository.update(
            {
              deleted_at: new Date(),
            },
            {
              where: {
                recruitment_requirement_id: dto.recruitment_requirement_id,
              },
              transaction,
            },
          );

          const created = dto.recruitment.df_province.map((e) => ({
            recruitment_requirement_id: dto.recruitment_requirement_id,
            df_province_id: e,
          }));
          await this.recruitmentRequirementProvinceRepository.bulkCreate(
            created,
            { transaction },
          );
        }
      }
    });

    const enterpriseAfterUpdate = await this.enterpriseRepository.findOne({
      where: {
        id: foundEnterprise.id,
      },
    });

    const recruitmentAfterUpdate = await this.enterpriseRepository.findOne({
      where: {
        id: foundEnterprise.id,
      },
    });

    return sendSuccess({
      data: {
        enterpriseAfterUpdate,
        recruitmentAfterUpdate,
      },
    });
  }

  async changeToProcessed(user_id: number, dto: RecruitmentRequirementDto) {
    const foundRecruitment =
      await this.recruitmentRequirementRepository.findOne({
        where: {
          id: dto.recruitment_requirement_id,
          created_by: user_id,
        },
      });
    if (!foundRecruitment) {
      throw new HttpException(
        'Tin tuyển dụng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.sequelize.transaction(async (transaction: Transaction) => {
      await this.recruitmentRequirementRepository.update(
        {
          status: RECRUITMENT_STATUS.PROCESSED,
          modify_date_processed: new Date(),
        },
        {
          where: {
            id: dto.recruitment_requirement_id,
          },
          transaction,
        },
      );

      //Cộng điểm cho HR
      let foundUserPoint: any = await this.userPointRepository.findOne({
        where: { user_id },
      });
      if (!foundUserPoint) {
        const userPoint = await this.userPointRepository.create(
          {
            user_id,
            point: 0,
          },
          { transaction },
        );
        foundUserPoint = userPoint;
      }

      const foundConfigPoint: any =
        await this.configPointHroRepository.findAll();

      await this.userPointRepository.update(
        {
          point:
            Number(foundUserPoint.point) + Number(foundConfigPoint[0].point),
        },
        {
          where: { user_id },
          transaction,
        },
      );

      //Tạo lịch sử tích luỹ điểm
      await this.userPointHistoryRepository.create(
        {
          user_point_id: foundUserPoint.id,
          type: POINT_TYPE.ADD,
          value: foundConfigPoint[0].point,
          current_point:
            Number(foundUserPoint.point) + Number(foundConfigPoint[0].point),
          mutable_type: POINT_MUTABLE_TYPE.ADD_CV,
          created_by: user_id,
          // note: dto.note || null,
        },
        { transaction },
      );

      await foundRecruitment.reload();
    });

    return sendSuccess({
      msg: 'Tin đăng tuyển thành công!',
      data: {
        recruitment_requirement: foundRecruitment,
      },
    });
  }

  async findAllApplied(
    user_id: number,
    dto: MiniAppFilterRecruitmentByCandidateDto,
  ) {
    // Tìm các tin tuyển dụng đã apply
    const foundCandidateInformation: any =
      await this.candidateInformationRepository.findOne({
        where: {
          user_id,
        },
        attributes: ['id', 'user_id'],
      });

    const foundApplyRecruitments =
      await this.candidateRecruitmentRepository.findAll({
        where: {
          candidate_information_id: foundCandidateInformation?.id,
          status: {
            [Op.ne]: CANDIDATE_RECRUITMENT_STATUS.PENDING_CV,
          },
        },
        attributes: [
          'id',
          'candidate_information_id',
          'recruitment_requirement_id',
          'status',
        ],
      });
    const applyRecruitmentsIds = foundApplyRecruitments?.map(
      (elm) => elm.recruitment_requirement_id,
    );

    // Tìm các tin tuyển dụng đã yêu thích
    const favoriteRecruitment =
      await this.userRecruitmentFavoriteRepository.findAll({
        where: {
          user_id,
        },
      });
    const favoriteRecruitmentIds = favoriteRecruitment?.map(
      (elm) => elm.recruitment_requirement_id,
    );

    const whereCondition: any = {
      [Op.and]: [
        {
          id: {
            [Op.in]: applyRecruitmentsIds,
          },
        },
      ],
    };

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }

    if (dto.search) {
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            position_input: { [Op.like]: `%${dto.search}%` },
          },
        ],
      });
    }

    if (dto.career_ids) {
      const careerIdsArray: any = dto.career_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            career_id: { [Op.in]: careerIdsArray },
          },
        ],
      });
      // whereCondition.career_id = { [Op.in]: careerIdsArray };
    }

    if (dto.years_of_experience_ids) {
      const yearsOfExperienceIdsArray: any = dto.years_of_experience_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            years_of_experience_id: { [Op.in]: yearsOfExperienceIdsArray },
          },
        ],
      });
    }

    if (dto.professional_field_ids) {
      const professionalFieldIds: any = dto.professional_field_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            professional_field_id: { [Op.in]: professionalFieldIds },
          },
        ],
      });
    }

    if (dto.position_ids) {
      const positionIds: any = dto.position_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            position_id: { [Op.in]: positionIds },
          },
        ],
      });
    }

    if (dto.salary_range_ids) {
      const salaryRangeIds: any = dto.salary_range_ids
        ?.split(',')
        .map((id) => parseInt(id));
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            salary_range_id: { [Op.in]: salaryRangeIds },
          },
        ],
      });
    }

    const includeCountOptions: any = [
      {
        model: Enterprise,
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'status', 'avatar'],
            as: 'user',
          },
        ],
      },
    ];
    const includeOptions: any = [
      {
        model: Enterprise,
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'status', 'avatar'],
            as: 'user',
          },
          {
            model: EnterpriseAddress,
            attributes: [
              'id',
              'df_province_id',
              'df_district_id',
              'df_ward_id',
              'address',
              'name',
            ],
            include: {
              model: DFProvince,
              attributes: ['id', 'name'],
            },
          },
        ],
      },
      {
        model: ProfessionalField,
      },
      {
        model: Position,
      },
      {
        model: CandidateRecruitment,
        include: [
          {
            model: CandidateInformation,
            as: 'candidate_information',
            include: [{ model: User }],
          },
        ],
      },
      { model: RecruitmentRequirementFile },
      { model: SalaryRange },
    ];

    let provinceDataInclude: any = {
      model: RecruitmentRequirementProvince,
      as: 'recruitment_requirement_province',
      include: {
        model: DFProvince,
        attributes: ['id', 'name'],
      },
    };
    if (dto.province_ids) {
      const provinceIdsArray: any = dto.province_ids
        .split(',')
        .map((id) => parseInt(id));
      const conditionProvince = {
        '$recruitment_requirement_province.df_province_id$': {
          [Op.in]: provinceIdsArray,
        },
      };
      provinceDataInclude = {
        model: RecruitmentRequirementProvince,
        as: 'recruitment_requirement_province',
        where: conditionProvince,
      };
    }
    includeCountOptions.push(provinceDataInclude);
    includeOptions.push(provinceDataInclude);

    const options: any = {
      where: whereCondition,
      attributes: {
        include: [],
      },
      include: includeOptions,
      order: ['status', ['updated_at', 'DESC']],
    };
    const countOptions: any = {
      where: whereCondition,
      include: includeCountOptions,
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

    const recruitments: any =
      await this.recruitmentRequirementRepository.findAll(options);

    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };

    //Maping các tin đã thích + các tin tuyển dụng đã ứng tuyển (đối với ứng viên)
    for (const recruitment of recruitments) {
      if (favoriteRecruitmentIds?.includes(recruitment.id)) {
        recruitment.dataValues.is_favorite = true;
      }
      if (applyRecruitmentsIds?.includes(recruitment.id)) {
        recruitment.dataValues.is_applied = true;
      } else {
        recruitment.dataValues.is_applied = false;
      }
    }

    return sendSuccess({
      data: recruitments,
      blocks: {
        status: RECRUITMENT_STATUS,
      },
      paging,
    });
  }

  async countCandidateRecruitmentWithStatus(
    user_id: number,
    dto: MiniAppFilterRecruitmentByCandidateDto,
  ) {
    const foundCandidateInformation = await CandidateInformation.findOne({
      where: {
        user_id,
      },
    });

    let result = await CandidateRecruitment.findAll({
      attributes: [
        'status',
        // [this.sequelize.fn('COUNT', this.sequelize.col('status')), 'count'],
        [
          this.sequelize.fn(
            'COUNT',
            this.sequelize.fn(
              'DISTINCT',
              this.sequelize.col('recruitment_requirement_id'),
            ),
          ),
          'count',
        ],
      ],
      group: ['status'],
      where: {
        candidate_information_id: foundCandidateInformation?.id,
        status: {
          [Op.in]: Object.values(CANDIDATE_RECRUITMENT_STATUS),
        },
      },
      raw: true,
    });

    // Mapping the results to include all statuses, even those with zero count
    const formattedResult = Object.keys(CANDIDATE_RECRUITMENT_STATUS).reduce(
      (acc, key) => {
        const statusKey = key as keyof typeof CANDIDATE_RECRUITMENT_STATUS;
        const statusValue = CANDIDATE_RECRUITMENT_STATUS[statusKey];

        // Tìm kết quả tương ứng trong result
        const foundResult: any = result.find(
          (curr: any) => curr.status === statusValue,
        );

        // Nếu tìm thấy thì gán giá trị count, nếu không thì gán 0
        acc[statusKey] = foundResult ? parseInt(foundResult.count, 10) : 0;
        return acc;
      },
      {} as Record<keyof typeof CANDIDATE_RECRUITMENT_STATUS, number>,
    );

    return sendSuccess({
      data: formattedResult,
      blocks: {
        status: CANDIDATE_RECRUITMENT_STATUS,
      },
    });
  }
}
