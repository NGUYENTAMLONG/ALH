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
import { PositionRepository } from '@repositories/position.repository';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateApplyFileRepository } from '@repositories/candidate-apply-file.repository';
import { CandidateApplyRepository } from '@repositories/candidate-apply.repository';
import { ConfigPointHroRepository } from '@repositories/config-point-hro.repository';
import { UserPointRepository } from '@repositories/user-point.repository';
import { UserPointHistoryRepository } from '@repositories/user-point-history.repository';
import { WebCandidateRecruitmentController } from './controller/recruitment.controller';
import { WebCandidateRecruitmentService } from './service/recruitment.service';
import { MiniAppCandidateModule } from 'src/v1/mini-app/features/candidate/candidate-mini-app.module';
import { MiniAppCandidateService } from 'src/v1/mini-app/features/candidate/service/candidate-mini-app.service';
import { DFDegreeRepository } from '@repositories/df-degree.repository';
import { ApplicationRepository } from '@repositories/application.repository';
import { ApplicationProvinceRepository } from '@repositories/application-province.repository';
import { ApplicationCareerRepository } from '@repositories/application-career.repository';
import { ApplicationJobTypeRepository } from '@repositories/application-job-type.repository';
import { WorkExperienceRepository } from '@repositories/work-experience.repository';
import { ApplicationCVRepository } from '@repositories/application-cv.repository';
import { WalletRequirementRepository } from '@repositories/wallet-requirement.repository';
import { DFBankRepository } from '@repositories/df-bank.repository';
import { EducationExperienceRepository } from '@repositories/education-experience.repository';
import { SkillExperienceRepository } from '@repositories/skill-experience.repository';
import { ReferrerRepository } from '@repositories/referrer.repository';
import { MiniAppRecruitmentService } from 'src/v1/mini-app/features/recruitment/service/recruitment.service';
import { CandidateInterestService } from 'src/v1/mini-app/features/candidate-interest/service/candidate-interest.service';
import { CandidateInterestRepository } from '@repositories/candidate-interest.repository';
import { CandidateInterestCareerRepository } from '@repositories/candidate-interest-career.repository';

@Module({
  imports: [
    WebsocketModule,
    MiniAppCandidateModule,
    CandidateRecruitmentModule,
  ],
  controllers: [WebCandidateRecruitmentController],
  providers: [
    WebCandidateRecruitmentService,
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
    PositionRepository,
    CandidateInformationRepository,
    CandidateApplyFileRepository,
    CandidateApplyRepository,
    UserPointRepository,
    ConfigPointHroRepository,
    UserPointHistoryRepository,
    MiniAppCandidateService,
    DFDegreeRepository,
    ApplicationRepository,
    ApplicationProvinceRepository,
    ApplicationJobTypeRepository,
    ApplicationCareerRepository,
    WorkExperienceRepository,
    ApplicationCVRepository,
    WalletRequirementRepository,
    DFBankRepository,
    EducationExperienceRepository,
    SkillExperienceRepository,
    ReferrerRepository,
    MiniAppRecruitmentService,
    CandidateInterestService,
    CandidateInterestRepository,
    CandidateInterestCareerRepository,
  ],
})
export class CandidateRecruitmentModule {}
