// Nest dependencies
import { Module } from '@nestjs/common';

// Local files
import { AgeGroupRepository } from '@repositories/age-group.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { GenderRepository } from '@repositories/gender.repository';
import { JobTypeRepository } from '@repositories/job-type.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { RecruitmentJobTypeRepository } from '@repositories/recruitment-job-type.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { RecruitmentTemplateJobTypeRepository } from '@repositories/recruitment-template-job-type.repository';
import { RecruitmentTemplateRepository } from '@repositories/recruitment-template.repository';
import { SalaryRangeRepository } from '@repositories/salary-range.repository';
import { UserRepository } from '@repositories/user.repository';
import { YearOfExperienceRepository } from '@repositories/year-of-experience.repository';
import { RecruitmentTemplateController } from './controller/recruitment-template.controller';
import { RecruitmentTemplateService } from './service/recruitment-template.service';

@Module({
  controllers: [RecruitmentTemplateController],
  providers: [
    RecruitmentTemplateService,
    ProfessionalFieldRepository,
    JobTypeRepository,
    DFProvinceRepository,
    YearOfExperienceRepository,
    GenderRepository,
    AgeGroupRepository,
    SalaryRangeRepository,
    EnterpriseRepository,
    RecruitmentJobTypeRepository,
    RecruitmentRequirementRepository,
    UserRepository,
    RecruitmentTemplateRepository,
    RecruitmentTemplateJobTypeRepository,
  ],
})
export class RecruitmentTemplateModule {}
