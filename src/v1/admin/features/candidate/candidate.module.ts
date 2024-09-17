//Nest dependencies
import { Module } from '@nestjs/common';
//Local files
import { CandidateFileRepository } from '@repositories/candidate-file.repository';
import { CandidateHireRequirementRepository } from '@repositories/candidate-hire-requirement.repository';
import { CandidateImageRepository } from '@repositories/candidate-image.repository';
import { CandidateInformationFileRepository } from '@repositories/candidate-information-file.repository';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateInterviewRepository } from '@repositories/candidate-interview.repository';
import { CandidateJobTypeRepository } from '@repositories/candidate-job-type.repository';
import { CandidateProvinceRepository } from '@repositories/candidate-province.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { HirePriceRepository } from '@repositories/hire-price.repository';
import { InterestListRepository } from '@repositories/interest-list.repository';
import { UserRepository } from '@repositories/user.repository';
import { WorkExperienceRepository } from '@repositories/work-experience.repository';
import { AdminCandidateController } from './controller/admin-candidate.controller';
import { AdminCandidateService } from './service/admin-candidate.service';
import { CandidateInterestRepository } from '@repositories/candidate-interest.repository';
import { CandidateInterestCareerRepository } from '@repositories/candidate-interest-career.repository';
import { WebsocketModule } from '@services/module/websocket.module';

@Module({
  imports: [WebsocketModule],
  controllers: [AdminCandidateController],
  providers: [
    AdminCandidateService,
    UserRepository,
    CandidateFileRepository,
    HirePriceRepository,
    CandidateImageRepository,
    CandidateFileRepository,
    CandidateJobTypeRepository,
    WorkExperienceRepository,
    CandidateInformationRepository,
    InterestListRepository,
    CandidateProvinceRepository,
    CandidateRecruitmentRepository,
    CandidateInterviewRepository,
    DFProvinceRepository,
    CandidateInformationFileRepository,
    CandidateHireRequirementRepository,
    CandidateInterestRepository,
    CandidateInterestCareerRepository,
  ],
})
export class AdminCandidateModule {}
