// Nest dependencies
import { Module } from '@nestjs/common';
// Local files
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
import { YearOfExperienceRepository } from '@repositories/year-of-experience.repository';
import { MailService } from '@services/mail.service';
import { WebsocketModule } from '@services/module/websocket.module';
import { WalletRepository } from '@repositories/wallet.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { EnterPriseAddressRepository } from '@repositories/enterprise-address.repository';
import { DFCareerRepository } from '@repositories/df-career.repository';
import { UserRecruitmentFavoriteRepository } from '@repositories/user-recruitment-favorite.repository';
import { MiniAppHRController } from './controller/hr.controller';
import { MiniAppHRService } from './service/hr.service';
import { CandidateInterestRepository } from '@repositories/candidate-interest.repository';
import { CandidateInterestCareerRepository } from '@repositories/candidate-interest-career.repository';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { UserRepository } from '@repositories/user.repository';
import { CandidateHireRequirementRepository } from '@repositories/candidate-hire-requirement.repository';
import { CandidateApplyFileRepository } from '@repositories/candidate-apply-file.repository';
import { CandidateApplyRepository } from '@repositories/candidate-apply.repository';
import { UserPointRepository } from '@repositories/user-point.repository';
import { UserPointHistoryRepository } from '@repositories/user-point-history.repository';

@Module({
  imports: [WebsocketModule],
  controllers: [MiniAppHRController],
  providers: [
    MiniAppHRService,
    RecruitmentRequirementRepository,
    EnterpriseRepository,
    ProfessionalFieldRepository,
    JobTypeRepository,
    DFProvinceRepository,
    YearOfExperienceRepository,
    GenderRepository,
    AgeGroupRepository,
    SalaryRangeRepository,
    RecruitmentJobTypeRepository,
    FeeOfRecruitmentRequirementRepository,
    RecruitmentRequirementHistoryRepository,
    RecruitmentRequirementProvinceRepository,
    CandidateInterviewRepository,
    CandidateRecruitmentRepository,
    MailService,
    RecruitmentRequirementImplementationRepository,
    RecruitmentRequirementFileRepository,
    RecruitmentRequirementHroRepository,
    WalletRepository,
    WalletHistoryRepository,
    EnterPriseAddressRepository,
    DFCareerRepository,
    UserRecruitmentFavoriteRepository,
    CandidateInterestRepository,
    CandidateInterestCareerRepository,
    CandidateInformationRepository,
    UserRepository,
    CandidateHireRequirementRepository,
    CandidateApplyFileRepository,
    CandidateApplyRepository,
    UserPointRepository,
    UserPointHistoryRepository,
  ],
})
export class MiniAppHRModule {}
