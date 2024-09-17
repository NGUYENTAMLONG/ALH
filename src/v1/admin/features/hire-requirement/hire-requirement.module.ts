// Nest dependencies
import { Module } from '@nestjs/common';
// Local dependencies
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
import { YearOfExperienceRepository } from '@repositories/year-of-experience.repository';
import { WebsocketModule } from '@services/module/websocket.module';
import { AdminHireRequirementController } from './controller/hire-requirement.controller';
import { AdminHireRequirementService } from './service/hire-requirement.service';

@Module({
  imports: [WebsocketModule],
  controllers: [AdminHireRequirementController],
  providers: [
    AdminHireRequirementService,
    HireRequirementRepository,
    EnterpriseRepository,
    ProfessionalFieldRepository,
    DFProvinceRepository,
    YearOfExperienceRepository,
    GenderRepository,
    AgeGroupRepository,
    HireRequirementProfessionalFieldRepository,
    HireRequirementProvinceRepository,
    HireRequirementResponsibleRepository,
    HireRequirementJobTypeRepository,
    HireRequirementGenderRepository,
    CandidateHireRequirementRepository,
    HireRequirementFileRepository,
  ],
})
export class AdminHireRequirementModule {}
