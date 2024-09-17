// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Other dependencies
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

// Local files
import { AgeGroupRepository } from '@repositories/age-group.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { GenderRepository } from '@repositories/gender.repository';
import { JobTypeRepository } from '@repositories/job-type.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { RecruitmentTemplateJobTypeRepository } from '@repositories/recruitment-template-job-type.repository';
import { RecruitmentTemplateRepository } from '@repositories/recruitment-template.repository';
import { SalaryRangeRepository } from '@repositories/salary-range.repository';
import { UserRepository } from '@repositories/user.repository';
import { YearOfExperienceRepository } from '@repositories/year-of-experience.repository';
import { IS_ACTIVE, ROLE } from '@utils/constants';
import { getDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { CreateRecruitmentTemplateDto } from '../dto/create-recruitment-template.dto';
import { FilterRecruitmentTemplateDto } from '../dto/filter-recruitment.dto';
import { UpdateRecruitmentTemplateDto } from '../dto/update-recruitment-template.dto';

@Injectable()
export class RecruitmentTemplateService {
  constructor(
    private readonly professionalFieldRepository: ProfessionalFieldRepository,
    private readonly jobTypeRepository: JobTypeRepository,
    private readonly dfProvinceRepository: DFProvinceRepository,
    private readonly yearOfExperienceRepository: YearOfExperienceRepository,
    private readonly genderRepository: GenderRepository,
    private readonly ageGroupRepository: AgeGroupRepository,
    private readonly salaryRangeRepository: SalaryRangeRepository,
    private readonly userRepository: UserRepository,
    private readonly recruitmentTemplateJobTypeRepository: RecruitmentTemplateJobTypeRepository,
    private readonly recruitmentTemplateRepository: RecruitmentTemplateRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async create(user_id: number, dto: CreateRecruitmentTemplateDto) {
    const userAdmin = await this.userRepository.findUserByIdAndRole(
      user_id,
      ROLE.ADMIN,
    );

    if (!userAdmin) {
      throw new HttpException(
        'Admin không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const nameRecruitmentTemplate =
      await this.recruitmentTemplateRepository.findName(dto.name);

    if (nameRecruitmentTemplate) {
      throw new HttpException(
        'Tên mẫu tuyển dụng đã tồn tại',
        HttpStatus.FOUND,
      );
    }

    const professionalField =
      await this.professionalFieldRepository.findProfessionalField(
        dto.professional_field_id,
      );

    if (!professionalField) {
      throw new HttpException(
        'Vị trí tuyển dụng không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    const cvRecruitmentJobType = JSON.parse(dto.recruitment_job_type);

    if (
      !Array.isArray(cvRecruitmentJobType) &&
      cvRecruitmentJobType.length === 0
    ) {
      throw new HttpException(
        'Vui lòng không bỏ trống hình thức làm việc',
        HttpStatus.NOT_FOUND,
      );
    }

    const jobType: any = await this.jobTypeRepository.foundJobType(
      cvRecruitmentJobType,
    );

    if (!Array.isArray(jobType) && jobType.length === 0) {
      throw new HttpException(
        'Hình thức làm việc không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    const province = await this.dfProvinceRepository.findProvince(
      dto.df_province,
    );

    if (!province) {
      throw new HttpException(
        'Khu vực làm việc không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const yearsOfExperience =
      await this.yearOfExperienceRepository.findYearOfExperience(
        dto.years_of_experience,
      );

    if (!yearsOfExperience) {
      throw new HttpException(
        'Kinh nghiệm làm việc không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const gender = await this.genderRepository.findGender(dto.gender);

    if (!gender) {
      throw new HttpException(
        'Giới tính không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const ageGroup = await this.ageGroupRepository.findAgeGroup(dto.age_group);

    if (!ageGroup) {
      throw new HttpException(
        'Nhóm độ tuổi không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const salaryRange = await this.salaryRangeRepository.findSalaryRange(
      dto.salary_range,
    );

    if (!salaryRange) {
      throw new HttpException(
        'Mức lương không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        const payloadCreate = {
          name: dto.name,
          professional_field_id: +dto.professional_field_id,
          df_province_id: +dto.df_province,
          years_of_experience_id: +dto.years_of_experience,
          gender_id: +dto.gender,
          age_group_id: +dto.age_group,
          salary_range_id: +dto.salary_range,
          recruitment_count: +dto.recruitment_count,
          job_description: dto.job_description,
          enterprise_introduction: dto.enterprise_introduction,
          benefits_and_treatment: dto.benefits_and_treatment,
          status: IS_ACTIVE.ACTIVE,
          apply_deadline: dto.apply_deadline || null,
          created_by: user_id,
        };

        const recruitment =
          await this.recruitmentTemplateRepository.createRecruitmentTemplate(
            payloadCreate,
            transaction,
          );

        const bulkCreate = [];
        for (const item of cvRecruitmentJobType) {
          bulkCreate.push({
            recruitment_requirement_id: recruitment?.id,
            job_type_id: item,
          });
        }

        for (const item of bulkCreate) {
          await this.recruitmentTemplateJobTypeRepository.create(item, {
            transaction,
          });
        }

        return recruitment;
      },
    );

    return sendSuccess({
      data: result,
      msg: 'Tạo mẫu yêu cầu tuyển ứng viên thành công',
      blocks: {
        status: [
          {
            id: IS_ACTIVE.ACTIVE,
            name: 'Hoạt động',
          },
          {
            id: IS_ACTIVE.INACTIVE,
            name: 'Ngưng hoạt động',
          },
        ],
      },
    });
  }

  async findAll(dto: FilterRecruitmentTemplateDto) {
    const options: any = {};

    const conditions: any = {};

    if (dto.search) {
      conditions.code = { [Op.like]: `%${dto.search || ''}%` };
    }

    if (dto.status) {
      conditions.status = dto.status;
    }

    if (dto.from_date && dto.to_date) {
      const fromDate = getDateTime(dto.from_date, 'fmonth');
      const toDate = getDateTime(dto.to_date, 'lmonth');

      conditions.created_at = { [Op.between]: [fromDate, toDate] };
    }

    const count = await this.recruitmentTemplateRepository.count({
      where: conditions,
    });

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    if (dto.page || dto.limit) {
      (options.offset = offset), (options.limit = page_size);
    }

    options.where = conditions;

    const recruitment =
      await this.recruitmentTemplateRepository.findAllRecruitmentTemplate(
        options,
      );

    const paging = {
      total_count,
      current_page,
      limit: dto.limit,
      offset,
    };

    return sendSuccess({
      data: recruitment,
      paging,
      blocks: {
        status: [
          {
            status: IS_ACTIVE.ACTIVE,
            name: 'Hoạt động',
          },
          {
            status: IS_ACTIVE.INACTIVE,
            name: 'Ngừng hoạt động',
          },
        ],
      },
    });
  }

  async findOne(id: number) {
    const recruitmentTemplate =
      await this.recruitmentTemplateRepository.findRecruitmentTemplate(id);

    if (!recruitmentTemplate) {
      throw new HttpException(
        'Mẫu yêu cầu tuyển dụng không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    return sendSuccess({ data: recruitmentTemplate });
  }

  async update(user_id: number, id: number, dto: UpdateRecruitmentTemplateDto) {
    const userAdmin = await this.userRepository.findUserByIdAndRole(
      user_id,
      ROLE.ADMIN,
    );

    if (!userAdmin) {
      throw new HttpException(
        'Admin không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const recruitmentTemplate =
      await this.recruitmentTemplateRepository.findRecruitmentTemplate(id);

    if (!recruitmentTemplate) {
      throw new HttpException(
        'Mẫu tuyển dụng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const nameRecruitmentTemplate =
      await this.recruitmentTemplateRepository.findNameUpdate(id, dto.name);

    if (nameRecruitmentTemplate) {
      throw new HttpException(
        'Tên mẫu tuyển dụng đã tồn tại',
        HttpStatus.FOUND,
      );
    }

    const professionalField =
      await this.professionalFieldRepository.findProfessionalField(
        dto.professional_field_id,
      );

    if (!professionalField) {
      throw new HttpException(
        'Vị trí tuyển dụng không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    const cvRecruitmentJobType = JSON.parse(dto.recruitment_job_type);

    if (
      !Array.isArray(cvRecruitmentJobType) &&
      cvRecruitmentJobType.length === 0
    ) {
      throw new HttpException(
        'Vui lòng không bỏ trống hình thức làm việc',
        HttpStatus.NOT_FOUND,
      );
    }

    const jobType: any = await this.jobTypeRepository.foundJobType(
      cvRecruitmentJobType,
    );

    if (!Array.isArray(jobType) && jobType.length === 0) {
      throw new HttpException(
        'Hình thức làm việc không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    const province = await this.dfProvinceRepository.findProvince(
      dto.df_province,
    );

    if (!province) {
      throw new HttpException(
        'Khu vực làm việc không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const yearsOfExperience =
      await this.yearOfExperienceRepository.findYearOfExperience(
        dto.years_of_experience,
      );

    if (!yearsOfExperience) {
      throw new HttpException(
        'Kinh nghiệm làm việc không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const gender = await this.genderRepository.findGender(dto.gender);

    if (!gender) {
      throw new HttpException(
        'Giới tính không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const ageGroup = await this.ageGroupRepository.findAgeGroup(dto.age_group);

    if (!ageGroup) {
      throw new HttpException(
        'Nhóm độ tuổi không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const salaryRange = await this.salaryRangeRepository.findSalaryRange(
      dto.salary_range,
    );

    if (!salaryRange) {
      throw new HttpException(
        'Mức lương không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        const payloadCreate = {
          name: dto.name,
          professional_field_id: +dto.professional_field_id,
          df_province_id: +dto.df_province,
          years_of_experience_id: +dto.years_of_experience,
          gender_id: +dto.gender,
          age_group_id: +dto.age_group,
          salary_range_id: +dto.salary_range,
          recruitment_count: +dto.recruitment_count,
          job_description: dto.job_description,
          enterprise_introduction: dto.enterprise_introduction,
          benefits_and_treatment: dto.benefits_and_treatment,
          status: dto.status || IS_ACTIVE.ACTIVE,
          apply_deadline: dto.apply_deadline || null,
          created_by: user_id,
        };

        await this.recruitmentTemplateRepository.updateRecruitmentTemplate(
          recruitmentTemplate.id,
          payloadCreate,
          transaction,
        );

        await this.recruitmentTemplateJobTypeRepository.destroyRecTemplateJobType(
          recruitmentTemplate.id,
          transaction,
        );

        const bulkCreate = [];
        for (const item of cvRecruitmentJobType) {
          bulkCreate.push({
            recruitment_requirement_id: recruitmentTemplate?.id,
            job_type_id: item,
          });
        }

        for (const item of bulkCreate) {
          await this.recruitmentTemplateJobTypeRepository.create(item, {
            transaction,
          });
        }

        return true;
      },
    );

    if (result) {
      await recruitmentTemplate.reload();
    }

    return sendSuccess({
      data: recruitmentTemplate,
      msg: 'Cập nhật mẫu yêu cầu tuyển ứng viên thành công',
      blocks: {
        status: [
          {
            id: IS_ACTIVE.ACTIVE,
            name: 'Hoạt động',
          },
          {
            id: IS_ACTIVE.INACTIVE,
            name: 'Ngưng hoạt động',
          },
        ],
      },
    });
  }

  async remove(user_id: number, id: number) {
    const userAdmin = await this.userRepository.findUserByIdAndRole(
      user_id,
      ROLE.ADMIN,
    );

    if (!userAdmin) {
      throw new HttpException(
        'Admin không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const recruitmentTemplate =
      await this.recruitmentTemplateRepository.findRecruitmentTemplate(id);

    await this.sequelize.transaction(async (transaction: Transaction) => {
      if (!recruitmentTemplate) {
        throw new HttpException(
          'Có lỗi xảy ra không thể lấy dữ liệu mẫu tuyển dụng lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await this.recruitmentTemplateRepository.destroyRecruitmentTemplate(
        id,
        transaction,
      );
    });

    return sendSuccess({
      data: recruitmentTemplate,
      msg: 'Xoá mẫu tuyển dùng thành công',
    });
  }
}
