// Nest dependencies
import { Module } from '@nestjs/common';
// Local dependencies
import { CandidateHireRequirementRepository } from '@repositories/candidate-hire-requirement.repository';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { HireRequirementRepository } from '@repositories/hire-requirement.repository';
import { UserRepository } from '@repositories/user.repository';
import { AdminCandidateHireRequirementController } from './controller/candidate-hire-requirement.controller';
import { AdminCandidateHireRequirementService } from './service/candidate-hire-requirement.service';

@Module({
  controllers: [AdminCandidateHireRequirementController],
  providers: [
    AdminCandidateHireRequirementService,
    CandidateHireRequirementRepository,
    HireRequirementRepository,
    CandidateInformationRepository,
    UserRepository,
  ],
})
export class AdminCandidateHireRequirementModule {}
