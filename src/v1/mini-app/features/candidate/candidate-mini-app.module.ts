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
import { MiniAppCandidateController } from './controller/candidate-mini-app.controller';
import { MiniAppCandidateService } from './service/candidate-mini-app.service';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateApplyRepository } from '@repositories/candidate-apply.repository';
import { CandidateApplyFileRepository } from '@repositories/candidate-apply-file.repository';
import { DFDegreeRepository } from '@repositories/df-degree.repository';
import { PositionRepository } from '@repositories/position.repository';
import { WorkExperienceRepository } from '@repositories/work-experience.repository';
import { ApplicationJobTypeRepository } from '@repositories/application-job-type.repository';
import { ApplicationRepository } from '@repositories/application.repository';
import { ApplicationProvinceRepository } from '@repositories/application-province.repository';
import { ApplicationCareerRepository } from '@repositories/application-career.repository';
import { ApplicationCVRepository } from '@repositories/application-cv.repository';
import { UserRepository } from '@repositories/user.repository';
import { WalletRequirementRepository } from '@repositories/wallet-requirement.repository';
import { DFBankRepository } from '@repositories/df-bank.repository';
import { EducationExperienceRepository } from '@repositories/education-experience.repository';
import { SkillExperienceRepository } from '@repositories/skill-experience.repository';
import { ReferrerRepository } from '@repositories/referrer.repository';

@Module({
  imports: [WebsocketModule],
  controllers: [MiniAppCandidateController],
  providers: [
    MiniAppCandidateService,
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
    CandidateInformationRepository,
    CandidateApplyRepository,
    CandidateApplyFileRepository,
    DFDegreeRepository,
    PositionRepository,
    WorkExperienceRepository,
    ApplicationRepository,
    ApplicationProvinceRepository,
    ApplicationCareerRepository,
    ApplicationJobTypeRepository,
    ApplicationCVRepository,
    UserRepository,
    WalletRepository,
    WalletHistoryRepository,
    WalletRequirementRepository,
    DFBankRepository,
    EducationExperienceRepository,
    SkillExperienceRepository,
    ReferrerRepository,
  ],
})
export class MiniAppCandidateModule {}
