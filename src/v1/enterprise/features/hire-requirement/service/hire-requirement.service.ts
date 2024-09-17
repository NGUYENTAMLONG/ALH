// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// Local dependencies
import { AgeGroupRepository } from '@repositories/age-group.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { GenderRepository } from '@repositories/gender.repository';
import { HireRequirementFileRepository } from '@repositories/hire-requirement-file.repository';
import { HireRequirementGenderRepository } from '@repositories/hire-requirement-gender.repository';
import { HireRequirementJobTypeRepository } from '@repositories/hire-requirement-job-type.repository';
import { HireRequirementProfessionalFieldRepository } from '@repositories/hire-requirement-professional-field.repository';
import { HireRequirementProvinceRepository } from '@repositories/hire-requirement-province.repository';
import { HireRequirementRepository } from '@repositories/hire-requirement.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { UserRepository } from '@repositories/user.repository';
import { YearOfExperienceRepository } from '@repositories/year-of-experience.repository';
import { HIRE_REQUIREMENT_STATUS, IS_ACTIVE, JOB_TYPE } from '@utils/constants';
import { generateUniqueWEPKey } from '@utils/generate-code-recruitment';
import { sendSuccess } from '@utils/send-success';

import { AgeGroup } from '@models/age-group.model';
import { CandidateHireRequirement } from '@models/candidate-hire-requirement.model';
import { CandidateInformation } from '@models/candidate-information.model';
import { CandidateJobType } from '@models/candidate-job-type.model';
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
import { convertDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { EnterpriseCreateHireRequirementDto } from '../dto/create-hire-requirement.dto';
import { FilterEnterpriseHireRequirementDto } from '../dto/filter-hire-requirement.dto';

@Injectable()
export class EnterpriseHireRequirementService {
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
    private readonly hireRequirementJobTypeRepository: HireRequirementJobTypeRepository,
    private readonly hireRequirementGenderRepository: HireRequirementGenderRepository,
    private readonly hireRequirementFileRepository: HireRequirementFileRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async create(user_id: number, dto: EnterpriseCreateHireRequirementDto) {
    const enterprise = await this.enterpriseRepository.findEnterprise(user_id);

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
    if (dto.is_all_province == IS_ACTIVE.ACTIVE) {
      if (dto.df_province && dto.df_province.length > 0) {
        throw new HttpException(
          'Vui lòng không chọn khu vực làm việc ',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (dto.df_province && dto.df_province.length > 0) {
      const province = await this.dfProvinceRepository.findAllProvince(
        dto.df_province,
      );

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
      const gender = await this.genderRepository.findAllGender(dto.gender_ids);

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

        if (dto.df_province && dto.df_province.length > 0) {
          const created = dto.df_province.map((e) => ({
            hire_requirement_id: hireRequirement.id,
            df_province_id: e,
          }));
          await this.hireRequirementProvinceRepository.bulkCreate(created, {
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

  async findAll(user_id: number, dto: FilterEnterpriseHireRequirementDto) {
    const enterprise = await this.enterpriseRepository.findEnterprise(user_id);

    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const whereCondition: any = { enterprise_id: enterprise.id, [Op.and]: [] };
    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }
    if (dto.search) {
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            name: { [Op.like]: `%${dto.search}%` },
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
    if (dto.job_type == JOB_TYPE.CALL) {
      whereCondition.type_on_call = IS_ACTIVE.ACTIVE;
    } else if (dto.job_type == JOB_TYPE.HOUR) {
      whereCondition.type_on_hour = IS_ACTIVE.ACTIVE;
    }

    const countOptions: any = {
      where: whereCondition,
    };

    const options: any = {
      where: whereCondition,
      include: [
        {
          model: HireRequirementProvince,
          attributes: {
            include: [
              [
                Sequelize.literal(
                  `(
                    SELECT name FROM df_province
                    WHERE id = hire_requirement_province.df_province_id
                    LIMIT 1
                   )`,
                ),
                'province_name',
              ],
            ],
          },
        },
        {
          model: HireRequirementFile,
        },
        {
          model: HireRequirementJobType,
          attributes: {
            include: [
              [
                Sequelize.literal(
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
      ],
      order: [['id', 'DESC']],
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

  async detail(user_id: number, id: number) {
    const enterprise = await this.enterpriseRepository.findEnterprise(user_id);

    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const hireRequirement = await this.hireRequirementRepository.findOne({
      where: { id, enterprise_id: enterprise.id },
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
        {
          model: CandidateHireRequirement,
          include: [
            {
              model: CandidateInformation,
              as: 'candidate_information',
              include: [
                {
                  model: User,
                  attributes: [
                    'id',
                    'full_name',
                    'phone_number',
                    'avatar',
                    'email',
                    'gender_id',
                  ],
                },
                {
                  model: CandidateJobType,
                  attributes: {
                    include: [
                      [
                        Sequelize.literal(
                          `(
                            SELECT name FROM job_type
                            WHERE id = \`candidate_hire_requirement->candidate_information->candidate_job_type\`.job_type_id
                            LIMIT 1
                           )`,
                        ),
                        'job_type_name',
                      ],
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    });
    if (!hireRequirement) {
      throw new HttpException(
        'Yêu cầu thuê không tồn tại trong hệ thống.',
        HttpStatus.NOT_FOUND,
      );
    }
    return sendSuccess({
      data: hireRequirement,
    });
  }

  async update(
    id: number,
    user_id: number,
    dto: EnterpriseCreateHireRequirementDto,
  ) {
    const hireRequirement =
      await this.hireRequirementRepository.findHireRequirement(id);

    if (!hireRequirement) {
      throw new HttpException(
        'Yêu cầu thuê không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const enterprise = await this.enterpriseRepository.findEnterprise(user_id);

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
}
