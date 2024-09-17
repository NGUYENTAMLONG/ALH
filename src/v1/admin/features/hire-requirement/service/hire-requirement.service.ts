// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// Local dependencies
import { AgeGroup } from '@models/age-group.model';
import { DFProvince } from '@models/df-province.model';
import { Enterprise } from '@models/enterprise.model';
import { Gender } from '@models/gender.model';
import { HireRequirementFile } from '@models/hire-requirement-file.model';
import { HireRequirementGender } from '@models/hire-requirement-gender.model';
import { HireRequirementJobType } from '@models/hire-requirement-job-type.model';
import { HireRequirementProfessionalField } from '@models/hire-requirement-professional-field.model';
import { HireRequirementProvince } from '@models/hire-requirement-province.model';
import { HireRequirementResponsible } from '@models/hire-requirement-responsible.model';
import { ProfessionalField } from '@models/professional-field.model';
import { User } from '@models/user.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { AgeGroupRepository } from '@repositories/age-group.repository';
import { CandidateHireRequirementRepository } from '@repositories/candidate-hire-requirement.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { GenderRepository } from '@repositories/gender.repository';
import { HireRequirementFileRepository } from '@repositories/hire-requirement-file.repository';
import { HireRequirementGenderRepository } from '@repositories/hire-requirement-gender.repository';
import { HireRequirementJobTypeRepository } from '@repositories/hire-requirement-job-type.repository';
import { HireRequirementProfessionalFieldRepository } from '@repositories/hire-requirement-professional-field.repository';
import { HireRequirementProvinceRepository } from '@repositories/hire-requirement-province.repository';
import { HireRequirementResponsibleRepository } from '@repositories/hire-requirement-responsible.repository';
import { HireRequirementRepository } from '@repositories/hire-requirement.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { UserRepository } from '@repositories/user.repository';
import { YearOfExperienceRepository } from '@repositories/year-of-experience.repository';
import {
  CANDIDATE_HIRE_REQUIREMENT_STATUS,
  HIRE_REQUIREMENT_STATUS,
  IS_ACTIVE,
  ROLE,
} from '@utils/constants';
import { convertDateTime } from '@utils/date-time';
import { generateUniqueWEPKey } from '@utils/generate-code-recruitment';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { AdminCreateHireRequirementDto } from '../dto/create-hire-requirement.dto';
import { AdminDeleteHireRequirementDto } from '../dto/delete-hire-requirement.dto';
import { AdminFilterHireRequirementDto } from '../dto/filter-hire-requirement.dto';

@Injectable()
export class AdminHireRequirementService {
  constructor(
    private readonly hireRequirementRepository: HireRequirementRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly professionalFieldRepository: ProfessionalFieldRepository,
    private readonly userRepository: UserRepository,
    private readonly dfProvinceRepository: DFProvinceRepository,
    private readonly yearOfExperienceRepository: YearOfExperienceRepository,
    private readonly genderRepository: GenderRepository,
    private readonly ageGroupRepository: AgeGroupRepository,
    private readonly hireRequirementProfessionalFieldRepository: HireRequirementProfessionalFieldRepository,
    private readonly hireRequirementProvinceRepository: HireRequirementProvinceRepository,
    private readonly hireRequirementResponsibleRepository: HireRequirementResponsibleRepository,
    private readonly hireRequirementJobTypeRepository: HireRequirementJobTypeRepository,
    private readonly hireRequirementGenderRepository: HireRequirementGenderRepository,
    private readonly candidateHireRequirementRepository: CandidateHireRequirementRepository,
    private readonly hireRequirementFileRepository: HireRequirementFileRepository,
    private readonly sequelize: Sequelize,
  ) {}
  async create(user_id: number, dto: AdminCreateHireRequirementDto) {
    const enterprise = await this.enterpriseRepository.findOne({
      where: { id: dto.enterprise_id },
    });

    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    if (dto.professional_field_ids) {
      for (let i = 0; i < dto.professional_field_ids.length; i++) {
        const professionalField =
          await this.professionalFieldRepository.findProfessionalField(
            dto.professional_field_ids[i],
          );

        if (!professionalField) {
          throw new HttpException(
            'Vị trí tuyển dụng không tồn tại',
            HttpStatus.NOT_FOUND,
          );
        }
      }
    }
    if (dto.implementation_sale_id) {
      const foundUser = await this.userRepository.findUserByIdAndRole(
        dto.implementation_sale_id,
        ROLE.IMPLEMENTATION_SALE,
      );
      if (!foundUser) {
        throw new HttpException(
          'Sale triển khai không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.responsible_sale_ids && dto.responsible_sale_ids.length > 0) {
      const foundResponsibleSale = await this.userRepository.findAll({
        where: {
          id: { [Op.in]: dto.responsible_sale_ids },
          role_id: ROLE.RESPONSIBLE_SALE,
        },
      });

      if (foundResponsibleSale?.length != dto.responsible_sale_ids.length) {
        throw new HttpException(
          'Sale Phụ trách không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.is_all_province == IS_ACTIVE.ACTIVE) {
      if (dto.df_province && dto.df_province.length > 0) {
        throw new HttpException(
          'Vui lòng không chọn khu vực làm việc ',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (dto.df_province && dto.df_province.length > 0) {
      const province = await this.dfProvinceRepository.findAll({
        where: {
          id: { [Op.in]: dto.df_province },
        },
      });

      if (province?.length != dto.df_province.length) {
        throw new HttpException(
          'Khu vực làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto.years_of_experience_id) {
      const yearsOfExperience =
        await this.yearOfExperienceRepository.findYearOfExperience(
          dto.years_of_experience_id,
        );

      if (!yearsOfExperience) {
        throw new HttpException(
          'Kinh nghiệm làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.gender_ids) {
      const gender = await this.genderRepository.findAll({
        where: {
          id: { [Op.in]: dto.gender_ids },
        },
      });

      if (gender?.length != dto.gender_ids.length) {
        throw new HttpException(
          'Giới tính không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.age_group_id) {
      const ageGroup = await this.ageGroupRepository.findAgeGroup(
        dto.age_group_id,
      );

      if (!ageGroup) {
        throw new HttpException(
          'Nhóm độ tuổi không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        const hireRequirementCreated = {
          enterprise_id: enterprise.id,
          years_of_experience_id: dto.years_of_experience_id || null,
          age_group_id: dto.age_group_id || null,
          created_by: user_id,
          implementation_sale_id: dto.implementation_sale_id || null,
          name: dto.name || null,
          recruitment_count: dto.recruitment_count || null,
          is_all_province: dto.is_all_province,
          note: dto.note,
          type_on_call: dto.type_on_call,
          type_on_hour: dto.type_on_hour,
          count: dto.count,
          price: dto.price,
          total_price: dto.total_price,
          budget_min: dto.budget_min,
          budget_max: dto.budget_max,
          status: HIRE_REQUIREMENT_STATUS.PENDING,
        };
        const hireRequirement =
          await this.hireRequirementRepository.createHireRequirement(
            hireRequirementCreated,
            transaction,
          );

        if (dto.jd && dto.jd.length > 0) {
          const dataCreated = dto.jd.map((e) => ({
            hire_requirement_id: hireRequirement.id,
            file: e.file,
            file_name: e.file_name,
          }));
          await this.hireRequirementFileRepository.bulkCreate(dataCreated, {
            transaction,
          });
        }

        if (dto.professional_field_ids) {
          const dataCreated = dto.professional_field_ids.map((e) => ({
            hire_requirement_id: hireRequirement.id,
            professional_field_id: e,
          }));
          await this.hireRequirementProfessionalFieldRepository.bulkCreate(
            dataCreated,
            { transaction },
          );
        }

        if (dto.df_province && dto.df_province.length > 0) {
          const created = dto.df_province.map((e) => ({
            hire_requirement_id: hireRequirement.id,
            df_province_id: e,
          }));
          await this.hireRequirementProvinceRepository.bulkCreate(created, {
            transaction,
          });
        }
        if (dto.responsible_sale_ids && dto.responsible_sale_ids.length > 0) {
          const created = dto.responsible_sale_ids.map((e) => ({
            hire_requirement_id: hireRequirement.id,
            user_id: e,
          }));
          await this.hireRequirementResponsibleRepository.bulkCreate(created, {
            transaction,
          });
        }
        if (dto.recruitment_job_type && dto.recruitment_job_type.length > 0) {
          const created = dto.recruitment_job_type.map((e) => ({
            hire_requirement_id: hireRequirement.id,
            job_type_id: e,
          }));
          await this.hireRequirementJobTypeRepository.bulkCreate(created, {
            transaction,
          });
        }
        if (dto.gender_ids && dto.gender_ids.length > 0) {
          const created = dto.gender_ids.map((e) => ({
            hire_requirement_id: hireRequirement.id,
            gender_id: e,
          }));
          await this.hireRequirementGenderRepository.bulkCreate(created, {
            transaction,
          });
        }
        const code = generateUniqueWEPKey();
        await hireRequirement.update({ code }, { transaction });

        return hireRequirement;
      },
    );
    return sendSuccess({ data: result, msg: 'Tạo yêu cầu thuê thành công' });
  }

  async findAll(user_id: number, dto: AdminFilterHireRequirementDto) {
    const foundUser = await this.userRepository.findByPk(user_id);
    if (!foundUser) {
      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const whereCondition: any = { [Op.and]: [] };
    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }
    if (dto.search) {
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            enterprise_id: {
              [Op.in]: [
                Sequelize.literal(
                  `SELECT enterprise.id FROM enterprise JOIN user ON user.id = enterprise.user_id
                  WHERE enterprise.name LIKE '%${dto.search}%'
                  OR user.full_name LIKE '%${dto.search}%' OR user.email LIKE '%${dto.search}%' OR user.phone_number LIKE '%${dto.search}%' `,
                ),
              ],
            },
          },
          {
            code: { [Op.like]: `%${dto.search}%` },
          },
        ],
      });
    }
    if (dto.status) {
      whereCondition.status = dto.status;
    }
    const options: any = {
      where: whereCondition,
      attributes: {
        include: [
          [
            this.sequelize.literal(
              `(
              SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_hire_requirement.status,${CANDIDATE_HIRE_REQUIREMENT_STATUS.PENDING})) as data FROM candidate_hire_requirement
              JOIN candidate_information ON candidate_information.id = candidate_hire_requirement.candidate_information_id
              WHERE hire_requirement_id = HireRequirement.id
              AND candidate_hire_requirement.deleted_at IS NULL
              AND candidate_hire_requirement.status = ${CANDIDATE_HIRE_REQUIREMENT_STATUS.PENDING}
              LIMIT 1
            )`,
            ),
            'candidate_pending',
          ],
          [
            this.sequelize.literal(
              `(
              SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_hire_requirement.status,${CANDIDATE_HIRE_REQUIREMENT_STATUS.WORKING})) as data FROM candidate_hire_requirement
              JOIN candidate_information ON candidate_information.id = candidate_hire_requirement.candidate_information_id
              WHERE hire_requirement_id = HireRequirement.id
              AND candidate_hire_requirement.deleted_at IS NULL
              AND candidate_hire_requirement.status = ${CANDIDATE_HIRE_REQUIREMENT_STATUS.WORKING}
              LIMIT 1
            )`,
            ),
            'candidate_working',
          ],
          [
            this.sequelize.literal(
              `(
              SELECT JSON_OBJECT('count',COUNT( DISTINCT candidate_information_id),'status',IFNULL(candidate_hire_requirement.status,${CANDIDATE_HIRE_REQUIREMENT_STATUS.REJECT})) as data FROM candidate_hire_requirement
              JOIN candidate_information ON candidate_information.id = candidate_hire_requirement.candidate_information_id
              WHERE hire_requirement_id = HireRequirement.id
              AND candidate_hire_requirement.deleted_at IS NULL
              AND candidate_hire_requirement.status = ${CANDIDATE_HIRE_REQUIREMENT_STATUS.REJECT}
              LIMIT 1
            )`,
            ),
            'candidate_reject',
          ],
          [
            this.sequelize.literal(
              `(
              SELECT GROUP_CONCAT(DISTINCT CONCAT(full_name)) FROM user
              JOIN hire_requirement_responsible ON hire_requirement_responsible.user_id = user.id
              WHERE hire_requirement_id = HireRequirement.id
              and hire_requirement_responsible.deleted_at IS NULL
              LIMIT 1
            )`,
            ),
            'responsible_sale',
          ],
        ],
      },
      include: [
        {
          model: Enterprise,
          include: {
            model: User,
            attributes: ['full_name', 'email', 'avatar', 'phone_number'],
            as: 'user',
          },
        },
        {
          model: User,
          attributes: ['full_name', 'email', 'avatar', 'phone_number'],
        },
      ],
      order: ['status', ['id', 'DESC']],
    };
    const countOptions = {
      where: whereCondition,
    };
    const count = await this.hireRequirementRepository.count(countOptions);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const hireRequirements = await this.hireRequirementRepository.findAll(
      options,
    );
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };

    return sendSuccess({
      data: hireRequirements,
      paging,
    });
  }

  async detail(id: number) {
    const hireRequirement = await this.hireRequirementRepository.findOne({
      where: { id },
      include: [
        {
          model: Enterprise,
          include: [
            {
              model: User,
              attributes: ['full_name', 'email', 'avatar', 'phone_number'],
              as: 'user',
            },
          ],
        },
        {
          model: User,
          attributes: ['full_name', 'email', 'avatar', 'phone_number'],
        },
        {
          model: HireRequirementProfessionalField,
          include: [
            {
              model: ProfessionalField,
            },
          ],
        },
        {
          model: HireRequirementProvince,
          include: [{ model: DFProvince }],
        },
        {
          model: YearOfExperience,
        },
        {
          model: AgeGroup,
        },
        {
          model: HireRequirementGender,
          include: [{ model: Gender }],
        },
        {
          model: HireRequirementResponsible,
          include: [
            {
              model: User,
              attributes: ['full_name', 'email', 'avatar', 'phone_number'],
            },
          ],
        },
        {
          model: HireRequirementJobType,
          attributes: {
            include: [
              [
                this.sequelize.literal(
                  `(
                    SELECT name FROM job_type
                    WHERE id = hire_requirement_job_type.job_type_id
                    LIMIT 1
                   )`,
                ),
                'job_type_name',
              ],
            ],
          },
        },
        {
          model: HireRequirementFile,
        },
      ],
    });

    return sendSuccess({
      data: hireRequirement,
    });
  }

  async update(id: number, dto: AdminCreateHireRequirementDto) {
    const hireRequirement =
      await this.hireRequirementRepository.findHireRequirement(id);

    if (!hireRequirement) {
      throw new HttpException(
        'Yêu cầu thuê không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const enterprise = await this.enterpriseRepository.findOne({
      where: { id: dto.enterprise_id },
      include: { model: User, as: 'user' },
    });

    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    if (dto.professional_field_ids) {
      for (let i = 0; i < dto.professional_field_ids.length; i++) {
        const professionalField =
          await this.professionalFieldRepository.findProfessionalField(
            dto.professional_field_ids[i],
          );

        if (!professionalField) {
          throw new HttpException(
            'Vị trí tuyển dụng không tồn tại',
            HttpStatus.NOT_FOUND,
          );
        }
      }
    }
    if (dto.implementation_sale_id) {
      const foundUser = await this.userRepository.findUserByIdAndRole(
        dto.implementation_sale_id,
        ROLE.IMPLEMENTATION_SALE,
      );
      if (!foundUser) {
        throw new HttpException(
          'Sale triển khai không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.responsible_sale_ids && dto.responsible_sale_ids.length > 0) {
      const foundResponsibleSale = await this.userRepository.findAll({
        where: {
          id: { [Op.in]: dto.responsible_sale_ids },
          role_id: ROLE.RESPONSIBLE_SALE,
        },
      });

      if (foundResponsibleSale?.length != dto.responsible_sale_ids.length) {
        throw new HttpException(
          'Sale Phụ trách không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.is_all_province == IS_ACTIVE.ACTIVE) {
      if (dto.df_province && dto.df_province.length > 0) {
        throw new HttpException(
          'Vui lòng không chọn khu vực làm việc ',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (dto.df_province && dto.df_province.length > 0) {
      const province = await this.dfProvinceRepository.findAll({
        where: {
          id: { [Op.in]: dto.df_province },
        },
      });

      if (province?.length != dto.df_province.length) {
        throw new HttpException(
          'Khu vực làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (dto.years_of_experience_id) {
      const yearsOfExperience =
        await this.yearOfExperienceRepository.findYearOfExperience(
          dto.years_of_experience_id,
        );

      if (!yearsOfExperience) {
        throw new HttpException(
          'Kinh nghiệm làm việc không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.gender_ids) {
      const gender = await this.genderRepository.findAll({
        where: {
          id: { [Op.in]: dto.gender_ids },
        },
      });

      if (gender?.length != dto.gender_ids.length) {
        throw new HttpException(
          'Giới tính không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (dto.age_group_id) {
      const ageGroup = await this.ageGroupRepository.findAgeGroup(
        dto.age_group_id,
      );

      if (!ageGroup) {
        throw new HttpException(
          'Nhóm độ tuổi không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    await this.sequelize.transaction(async (transaction: Transaction) => {
      const payloadUpdate = {
        enterprise_id: +enterprise.id,
        years_of_experience_id: dto.years_of_experience_id || null,
        age_group_id: dto.age_group_id || null,
        implementation_sale_id: dto.implementation_sale_id || null,
        name: dto.name || null,
        recruitment_count: dto.recruitment_count || null,
        is_all_province: dto.is_all_province || null,
        note: dto.note,
        type_on_call: dto.type_on_call || 0,
        type_on_hour: dto.type_on_hour || 0,
        count: dto.count || null,
        price: dto.price || null,
        total_price: dto.total_price || null,
        budget_min: dto.budget_min || null,
        budget_max: dto.budget_max || null,
        status: dto.status,
      };
      await hireRequirement.update(payloadUpdate, { transaction });
      if (dto.is_all_province == IS_ACTIVE.ACTIVE) {
        await this.hireRequirementProvinceRepository.destroy({
          where: {
            hire_requirement_id: hireRequirement.id,
          },
          transaction,
        });
      } else if (dto.df_province && dto.df_province.length > 0) {
        const listIdsCreate =
          await this.hireRequirementProvinceRepository.bulkDeleteProvince(
            id,
            dto.df_province,
            transaction,
          );
        await this.hireRequirementProvinceRepository.bulkCreateProvince(
          id,
          listIdsCreate || [],
          transaction,
        );
      }

      if (dto.responsible_sale_ids) {
        const listIdsCreate =
          await this.hireRequirementResponsibleRepository.bulkDeleteResponsibleSale(
            id,
            dto.responsible_sale_ids,
            transaction,
          );
        const dataCreated =
          await this.hireRequirementResponsibleRepository.bulkCreateResponsibleSale(
            id,
            listIdsCreate || [],
            transaction,
          );
      }
      if (dto.professional_field_ids) {
        const listIdsCreate =
          await this.hireRequirementProfessionalFieldRepository.bulkDeleteProfessionalField(
            id,
            dto.professional_field_ids,
            transaction,
          );
        const dataCreated =
          await this.hireRequirementProfessionalFieldRepository.bulkCreateProfessionalField(
            id,
            listIdsCreate || [],
            transaction,
          );
      }
      if (dto.recruitment_job_type) {
        const listIdsCreate =
          await this.hireRequirementJobTypeRepository.bulkDeleteJobType(
            id,
            dto.professional_field_ids,
            transaction,
          );
        const dataCreated =
          await this.hireRequirementJobTypeRepository.bulkCreateJobType(
            id,
            listIdsCreate || [],
            transaction,
          );
      }
      if (dto.gender_ids) {
        const listIdsCreate =
          await this.hireRequirementGenderRepository.bulkDeleteGender(
            id,
            dto.gender_ids,
            transaction,
          );
        const dataCreated =
          await this.hireRequirementGenderRepository.bulkCreateGender(
            id,
            listIdsCreate || [],
            transaction,
          );
      }
      await this.hireRequirementFileRepository.destroy({
        where: {
          hire_requirement_id: hireRequirement.id,
        },
        transaction,
      });
      if (dto.jd && dto.jd.length > 0) {
        const dataCreated = dto.jd.map((e) => ({
          hire_requirement_id: hireRequirement.id,
          file: e.file,
          file_name: e.file_name,
        }));
        await this.hireRequirementFileRepository.bulkCreate(dataCreated, {
          transaction,
        });
      }
    });
    await hireRequirement?.reload();

    return sendSuccess({ data: hireRequirement });
  }

  async delete(dto: AdminDeleteHireRequirementDto) {
    await this.sequelize.transaction(async (transaction: Transaction) => {
      await this.hireRequirementRepository.destroy({
        where: { id: { [Op.in]: dto.ids } },
        transaction,
      });
      await this.candidateHireRequirementRepository.destroy({
        where: { hire_requirement_id: { [Op.in]: dto.ids } },
        transaction,
      });
    });
    return sendSuccess({ msg: 'Xóa yêu cầu thuê thành công!' });
  }
}
