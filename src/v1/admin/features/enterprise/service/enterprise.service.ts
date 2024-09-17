// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Other dependencies
import * as _ from 'lodash';
import { Op, QueryTypes, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

// Local files
import { DFDistrict } from '@models/df-district.model';
import { DFProvince } from '@models/df-province.model';
import { DFWard } from '@models/df-ward.model';
import { RecruitmentRequirement } from '@models/recruitment-requirement.model';
import { User } from '@models/user.model';
import { CandidateInterviewRepository } from '@repositories/candidate-interview.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { EnterPriseAddressRepository } from '@repositories/enterprise-address.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { InterestListRepository } from '@repositories/interest-list.repository';
import { PositionRepository } from '@repositories/position.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { RecruitmentRequirementHroRepository } from '@repositories/recruitment-requirement-hro.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { UserRepository } from '@repositories/user.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { configService } from '@services/config.service';
import { MailService } from '@services/mail.service';
import {
  IS_ACTIVE,
  RECRUITMENT_STATUS,
  ROLE,
  WALLET_MUTABLE_TYPE,
  WALLET_TYPE,
  getFullUrl,
} from '@utils/constants';
import { arrayToQuery } from '@utils/convert-array-to-like-query';
import { convertDateTime } from '@utils/date-time';
import { isArray } from '@utils/is-array';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { CreateEnterPriseAdminDto } from '../dto/create-enterprise-admin.dto';
import { DeleteEnterPriseAdminDto } from '../dto/delete-enterprise-admin.dto';
import {
  AdminFilterRecruitmentOfEnterpriseDto,
  ListEnterpriseAdminDto,
} from '../dto/list-enterprise-admin.dto';
import { UpdateEnterPriseAdminDto } from '../dto/update-enterprise-admin.dto';
import { UpdateEnterpriseStatusDto } from '../dto/update-enterprise-status.dto';
import { Enterprise } from '@models/enterprise.model';
import { EnterpriseAddress } from '@models/enterprise-address.model';
import { ProfessionalField } from '@models/professional-field.model';
import { Position } from '@models/position.model';
import { CandidateRecruitment } from '@models/candidate-recruitment.model';
import { CandidateInformation } from '@models/candidate-information.model';
import { RecruitmentRequirementFile } from '@models/recruitment-requirement-file.model';
import { SalaryRange } from '@models/salary-range.model';
import { RecruitmentRequirementProvince } from '@models/recruitment-requirement-province.model';
import * as moment from 'moment';
import { RecruitmentRequirementHro } from '@models/recruitment-requirement-hro.model';
import { RecruitmentRequirementImplementation } from '@models/recruitment-requirement-implementation.model';
import { RecruitmentJobType } from '@models/recruitment-job-type.model';
import { RecruitmentRequirementHistory } from '@models/recruitment-requirement-history.model';
import { FeeOfRecruitmentRequirement } from '@models/fee-of-recruitment-requirement.model';
import { AgeGroup } from '@models/age-group.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { FeeType } from '@models/fee-type.model';

@Injectable()
export class EnterpriseService {
  constructor(
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly userRepository: UserRepository,
    private readonly positionRepository: PositionRepository,
    private readonly professionalFieldRepository: ProfessionalFieldRepository,
    private readonly mailService: MailService,
    private readonly enterPriseAddressRepository: EnterPriseAddressRepository,
    private readonly walletRepository: WalletRepository,
    private readonly walletHistoryRepository: WalletHistoryRepository,
    private readonly interestListRepository: InterestListRepository,
    private readonly recruitmentRequirementRepository: RecruitmentRequirementRepository,
    private readonly candidateRecruitmentRepository: CandidateRecruitmentRepository,
    private readonly candidateInterviewRepository: CandidateInterviewRepository,
    private readonly recruitmentRequirementHroRepository: RecruitmentRequirementHroRepository,
    private sequelize: Sequelize,
  ) {}

  async findOne(id: number) {
    const foundEnterPrise = await this.enterpriseRepository.findOne({
      where: {
        id,
      },
      include: [
        {
          model: User,
          as: 'user',
        },
        {
          model: User,
          as: 'employees',
        },
      ],
    });

    if (!foundEnterPrise) {
      throw new HttpException(
        'Công ty không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const salePerson = await this.userRepository.findByPk(
      foundEnterPrise.responsible_sale_id,
    );
    const professionalField = await this.professionalFieldRepository.findOne({
      where: {
        id: foundEnterPrise.professional_field_id,
      },
    });

    const enterpriseAddress = await this.enterPriseAddressRepository.findOne({
      where: {
        enterprise_id: foundEnterPrise.id,
      },
      include: [
        {
          model: DFDistrict,
        },
        {
          model: DFWard,
        },
        {
          model: DFProvince,
        },
      ],
    });

    const data = {
      full_name: foundEnterPrise.user.full_name,
      email: foundEnterPrise.user.email,
      phone_number: foundEnterPrise.user.phone_number,
      alternate_phone: foundEnterPrise.user.alternate_phone || null,
      name: foundEnterPrise.name,
      logo: foundEnterPrise.logo || null,
      description: foundEnterPrise.description,
      status: foundEnterPrise.status,
      tax_code: foundEnterPrise.tax_code,
      website: foundEnterPrise.website,
      linkedin: foundEnterPrise.linkedin,
      facebook: foundEnterPrise.facebook,
      salesperson: salePerson ? salePerson.full_name : null,
      responsible_sale_id: foundEnterPrise.responsible_sale_id,
      manager: foundEnterPrise.user.full_name,
      position: foundEnterPrise.position,
      professional_field: professionalField,
      professional_field_text: foundEnterPrise.professional_field_text,
      enterprise_address: enterpriseAddress,
      user_id: foundEnterPrise.user.id,
    };

    return sendSuccess({ data });
  }

  async updateEnterpriseStatus(
    enterprise_id: number,
    dto: UpdateEnterpriseStatusDto,
  ): Promise<any> {
    const foundEnterPrise = await this.enterpriseRepository.findOne({
      where: {
        id: enterprise_id,
      },
    });

    if (!foundEnterPrise) {
      throw new HttpException(
        'Công ty không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const foundUser = await this.userRepository.findOne({
      where: {
        id: foundEnterPrise.user_id,
      },
    });
    if (!foundUser) {
      throw new HttpException(
        'Tài khoản không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.sequelize.transaction(async (transaction: Transaction) => {
      await foundEnterPrise.update(
        {
          status: dto.status,
        },
        {
          transaction,
        },
      );
      await foundUser.update({ status: dto.status });
    });

    return sendSuccess({ msg: 'Cập nhật trạng thái công ty thành công' });
  }

  async updateEnterprise(
    enterprise_id: number,
    dto: UpdateEnterPriseAdminDto,
  ): Promise<any> {
    const foundEnterPrise = await this.enterpriseRepository.findOne({
      where: {
        id: enterprise_id,
      },
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });

    if (!foundEnterPrise) {
      throw new HttpException(
        'Công ty không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const foundPhoneNumber = await this.userRepository.findOne({
      where: {
        phone_number: dto.phone_number,
        id: { [Op.ne]: foundEnterPrise.user.id },
        enterprise_id: {
          [Op.ne]: foundEnterPrise.id,
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
        id: { [Op.ne]: foundEnterPrise.user.id },
      },
    });

    if (foundEmail) {
      throw new HttpException(
        'Email đã tồn tại trên hệ thống',
        HttpStatus.FOUND,
      );
    }

    if (dto.tax_code) {
      const foundTaxCode = await this.enterpriseRepository.findOne({
        where: {
          tax_code: dto.tax_code,
          id: { [Op.ne]: foundEnterPrise.id },
        },
      });

      if (foundTaxCode) {
        throw new HttpException(
          'Mã số thuế đã tồn tại trên hệ thống',
          HttpStatus.FOUND,
        );
      }
    }
    const enterpriseAddress = await this.enterPriseAddressRepository.findOne({
      where: {
        enterprise_id: enterprise_id,
      },
    });
    // transaction
    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        const payloadCreateUser: any = {
          full_name: dto.manager,
          email: dto.email,
          phone_number: dto.phone_number,
          alternate_phone: dto?.alternate_phone || null,
        };

        const user = await this.userRepository.updateEnterpriseAdmin(
          foundEnterPrise.user_id,
          payloadCreateUser,
          ROLE.ENTERPRISE,
          transaction,
        );

        let payloadCreateEnterprise: any = {
          position: dto.position,
          professional_field_text: dto.professional_field_text,
          user_id: user.id,
          name: dto.enterprise_name,
          logo: dto.logo ? dto.logo : foundEnterPrise.logo,
          description: dto.description,
          status: IS_ACTIVE.ACTIVE,
          tax_code: dto.tax_code,
          website: dto.website,
          linkedin: dto.linkedin,
          facebook: dto.facebook,
          responsible_sale_id: dto.responsible_sale_id,
          manager: user.full_name,
        };

        await this.enterpriseRepository.updateEnterpriseAdmin(
          foundEnterPrise.id,
          payloadCreateEnterprise,
          transaction,
        );

        payloadCreateEnterprise = _.omit(payloadCreateEnterprise, [
          'position_id',
          'user_id',
        ]);

        payloadCreateEnterprise.position = dto.position;

        const payloadResponse = {
          ...payloadCreateUser,
          ...payloadCreateEnterprise,
        };
        if (enterpriseAddress) {
          await enterpriseAddress.update(
            {
              df_province_id: dto.province || null,
              df_district_id: dto.district || null,
              df_ward_id: dto.ward || null,
              address: dto.address || null,
            },
            {
              transaction,
            },
          );
        } else {
          await this.enterPriseAddressRepository.create(
            {
              enterprise_id,
              df_province_id: dto.province || null,
              df_district_id: dto.district || null,
              df_ward_id: dto.ward || null,
              address: dto.address || null,
            },
            {
              transaction,
            },
          );
        }

        return payloadResponse;
      },
    );
    return sendSuccess({ data: result });
  }

  async createEnterprise(dto: CreateEnterPriseAdminDto): Promise<any> {
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
    if (dto.tax_code) {
      const foundTaxCode = await this.enterpriseRepository.findOne({
        where: {
          tax_code: dto.tax_code,
        },
      });

      if (foundTaxCode) {
        throw new HttpException(
          'Mã số thuế đã tồn tại trên hệ thống',
          HttpStatus.FOUND,
        );
      }
    }

    // transaction
    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        let payloadCreateUser: any = {
          full_name: dto.manager,
          email: dto.email,
          phone_number: dto.phone_number,
          alternate_phone: dto?.alternate_phone || null,
          verify_password: dto.password,
        };

        const user = await this.userRepository.createEnterpriseAdmin(
          payloadCreateUser,
          ROLE.ENTERPRISE,
          transaction,
        );

        let payloadCreateEnterprise: any = {
          position: dto.position,
          professional_field_text: dto.professional_field_text,
          user_id: user.id,
          name: dto.enterprise_name,
          logo: dto.logo,
          description: dto.description,
          status: IS_ACTIVE.ACTIVE,
          tax_code: dto.tax_code,
          website: dto.website,
          linkedin: dto.linkedin,
          facebook: dto.facebook,
          responsible_sale_id: dto.responsible_sale_id,
          manager: user.full_name,
        };

        const enterprise =
          await this.enterpriseRepository.createEnterpriseAdmin(
            payloadCreateEnterprise,
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

        await this.enterPriseAddressRepository.create(
          {
            enterprise_id: enterprise.id,
            df_province_id: dto.province,
            df_district_id: dto.district || null,
            df_ward_id: dto.ward || null,
            name: dto.address,
            address: dto.address,
          },
          { transaction },
        );

        payloadCreateUser = _.omit(payloadCreateUser, ['verify_password']);

        payloadCreateEnterprise = _.omit(payloadCreateEnterprise, [
          'position_id',
          'user_id',
        ]);

        payloadCreateEnterprise.position = dto.position;

        const payloadResponse = {
          ...payloadCreateUser,
          ...payloadCreateEnterprise,
          enterprise_id: enterprise.id,
        };
        return payloadResponse;
      },
    );
    if (result?.email) {
      await this.mailService.sendPasswordCreateEnterprise({
        receiver_email: result.email,
        reciever_fullname: result.full_name,
        subject: '[AleHub] Tài khoản Doanh nghiệp',
        text: {
          logo_url: configService.getEnv('LOGO_URL'),
          email: result.email,
          password: dto.password,
          phone_number: result.phone_number,
          webLoginEnterprise: configService.getEnv('WEB_ENTERPRISE'),
        },
      });
    }
    return sendSuccess({ data: result });
  }

  async getEnterprise(
    user_id: number,
    dto: ListEnterpriseAdminDto,
  ): Promise<any> {
    const foundUser = await this.userRepository.findByPk(user_id);
    if (!foundUser) {
      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    let listID: number[] = [];
    if (foundUser.role_id == ROLE.HRO) {
      const foundRecruitmentRequirementHro =
        await this.recruitmentRequirementHroRepository.findAll({
          where: {
            user_id,
          },
          include: { model: RecruitmentRequirement, required: true },
        });

      if (
        foundRecruitmentRequirementHro &&
        foundRecruitmentRequirementHro.length > 0
      ) {
        listID = foundRecruitmentRequirementHro.map(
          (e) => e.recruitment_requirement.enterprise_id,
        );
      }
    }
    const replacements: any = {};
    let rawQueryCount = `
    SELECT  COUNT(DISTINCT et.id) as total_count
    FROM \`user\` u
    JOIN enterprise et ON u.id = et.user_id
    LEFT JOIN enterprise_address etd ON etd.enterprise_id = et.id
    LEFT JOIN df_province dfp ON dfp.id = etd.df_province_id
    WHERE et.deleted_at IS NULL
    ${
      foundUser.role_id == ROLE.HRO
        ? listID.length > 0
          ? `AND et.id IN (${listID})`
          : `AND et.id IN (0)`
        : ''
    }
    `;

    let rawQuery = `
     SELECT 
    DISTINCT(et.id),
    et.\`name\` AS enterprise_name,
    et.logo,
    u.phone_number,
    u.email,
    u.full_name,
    et.\`status\`,
    et.created_at,
    etd.df_province_id,
    (SELECT full_name FROM user WHERE id = et.responsible_sale_id ) as responsible_sale
    FROM \`user\` u
    JOIN enterprise et ON u.id = et.user_id
    LEFT JOIN enterprise_address etd ON etd.enterprise_id = et.id
    LEFT JOIN df_province dfp ON dfp.id = etd.df_province_id
    WHERE et.deleted_at IS NULL
    ${
      foundUser.role_id == ROLE.HRO
        ? listID.length > 0
          ? `AND et.id IN (${listID})`
          : `AND et.id IN (0)`
        : ''
    }
    `;

    if (dto.search) {
      const subCondition =
        ' AND (et.name LIKE :search OR u.email LIKE :search OR u.phone_number LIKE :search)';
      rawQuery += subCondition;
      rawQueryCount += subCondition;
      replacements.search = `%${dto.search || ''}%`;
    }

    if (dto.province) {
      const subCondition = ` AND etd.df_province_id IN (${dto.province})`;
      rawQuery += subCondition;
      rawQueryCount += subCondition;
    }

    if (dto.status) {
      const subCondition = ` AND et.status = ${dto.status}`;
      rawQuery += subCondition;
      rawQueryCount += subCondition;
    }

    if (isArray(dto.salesperson)) {
      const subCondition = ` AND ${arrayToQuery(
        'et.salesperson',
        dto.salesperson,
        'like',
      )}`;

      rawQuery += subCondition;
      rawQueryCount += subCondition;
    }

    if (isArray(dto.professional_field)) {
      const subCondition = ` AND ${arrayToQuery(
        'et.professional_field.id',
        dto.professional_field,
        'equal',
      )}`;

      rawQuery += subCondition;
      rawQueryCount += subCondition;
    }

    if (dto.from_date && dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      const subCondition = ` AND et.created_at BETWEEN '${fromDate}' AND '${toDate}'`;

      rawQuery += subCondition;
      rawQueryCount += subCondition;
    }

    const count = await this.enterpriseRepository.query(rawQueryCount, {
      replacements,
      type: QueryTypes.SELECT,
    });

    const { current_page, page_size, total_count, offset } = paginateData(
      count[0].total_count,
      dto.page,
      dto.limit,
    );

    rawQuery += ` ORDER BY et.created_at DESC`;

    if (dto.page || dto.limit) {
      rawQuery += ` LIMIT ${page_size} OFFSET ${offset}`;
    }

    const enterprise = await this.enterpriseRepository.query(rawQuery, {
      replacements,
      type: QueryTypes.SELECT,
    });

    for (const item of enterprise) {
      item.logo = getFullUrl(item.logo);
    }

    const paging = {
      total_count,
      current_page,
      limit: dto.limit,
      offset,
    };

    return sendSuccess({
      data: enterprise,
      paging,
    });
  }

  async deleteEnterprise(dto: DeleteEnterPriseAdminDto) {
    const foundEnterprise = await this.enterpriseRepository.findAll({
      where: { id: { [Op.in]: dto.ids } },
    });
    if (!foundEnterprise) {
      throw new HttpException(
        'DOanh nghiệp không tồn tại trên hệ thống!',
        HttpStatus.NOT_FOUND,
      );
    }
    const foundRecruitmentRequirement =
      await this.recruitmentRequirementRepository.findAll({
        where: {
          enterprise_id: { [Op.in]: dto.ids },
        },
      });
    let candidateRecruitmentIDs: string | any[] = [];
    if (foundRecruitmentRequirement && foundRecruitmentRequirement.length > 0) {
      const foundCandidateRecruitment =
        await this.candidateRecruitmentRepository.findAll({
          where: {
            recruitment_requirement_id: {
              [Op.in]: foundRecruitmentRequirement.map((e) => e.id),
            },
          },
        });
      if (foundCandidateRecruitment && foundCandidateRecruitment.length > 0) {
        candidateRecruitmentIDs = foundCandidateRecruitment.map((e) => e.id);
      }
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      await this.enterpriseRepository.destroy({
        where: {
          id: { [Op.in]: dto.ids },
        },
        transaction,
      });
      await this.userRepository.destroy({
        where: {
          id: { [Op.in]: foundEnterprise.map((e) => e.user_id) },
        },
        transaction,
      });
      await this.enterPriseAddressRepository.destroy({
        where: {
          enterprise_id: { [Op.in]: dto.ids },
        },
        transaction,
      });
      await this.interestListRepository.destroy({
        where: {
          enterprise_id: { [Op.in]: dto.ids },
        },
        transaction,
      });
      await this.recruitmentRequirementRepository.destroy({
        where: {
          enterprise_id: { [Op.in]: dto.ids },
        },
        transaction,
      });
      if (candidateRecruitmentIDs.length > 0) {
        await this.candidateRecruitmentRepository.destroy({
          where: {
            id: { [Op.in]: candidateRecruitmentIDs },
          },
          transaction,
        });
        await this.candidateInterviewRepository.destroy({
          where: {
            candidate_recruitment_id: { [Op.in]: candidateRecruitmentIDs },
          },
          transaction,
        });
      }
    });
    return sendSuccess({ msg: 'Xóa doanh nghiệp thành công' });
  }

  async findAllRecruitmentOfEnterprise(
    enterprise_id: number,
    dto: AdminFilterRecruitmentOfEnterpriseDto,
  ) {
    const foundEnterprise = await this.enterpriseRepository.findOne({
      where: {
        id: enterprise_id,
      },
      include: [
        {
          model: User,
          as: 'user',
        },
        {
          model: User,
          as: 'employees',
          attributes: ['id', 'full_name', 'phone_number', 'email', 'role_id'],
        },
      ],
    });

    if (!foundEnterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const whereCondition: any = {
      [Op.and]: [
        {
          enterprise_id,
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
        .map((id: any) => parseInt(id));
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
      order: [['updated_at', 'DESC']],
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
      data: { enterprise: foundEnterprise, recruitments },
      blocks: {
        status: RECRUITMENT_STATUS,
      },
      paging,
    });
  }

  async detailRecruitmentRequirement(id: number) {
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

    return sendSuccess({
      data: recruitment,
      blocks: {
        status: RECRUITMENT_STATUS,
      },
    });
  }
}
