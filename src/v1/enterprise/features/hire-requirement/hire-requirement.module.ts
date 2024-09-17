// Nest dependencies
import { Module } from '@nestjs/common';
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
import { EnterpriseHireRequirementController } from './controller/hire-requirement.controller';
import { EnterpriseHireRequirementService } from './service/hire-requirement.service';

@Module({
  controllers: [EnterpriseHireRequirementController],
  providers: [
    EnterpriseHireRequirementService,
    HireRequirementRepository,
    EnterpriseRepository,
    ProfessionalFieldRepository,
    UserRepository,
    DFProvinceRepository,
    YearOfExperienceRepository,
    GenderRepository,
    AgeGroupRepository,
    HireRequirementProfessionalFieldRepository,
    HireRequirementProvinceRepository,
    HireRequirementJobTypeRepository,
    HireRequirementGenderRepository,
    HireRequirementFileRepository,
  ],
})
export class EnterpriseHireRequirementModule {}
