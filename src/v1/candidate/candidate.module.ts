// Nest dependencies
import { Module } from '@nestjs/common';

// Local files
import { EnterPriseAddressRepository } from '@repositories/enterprise-address.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { PositionRepository } from '@repositories/position.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { UserRepository } from '@repositories/user.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { FeaturesModule } from './features/features.module';
import { CandidateService } from './service/candidate.service';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateController } from './controller/candidate.controller';
import { MiniAppCandidateService } from '../mini-app/features/candidate/service/candidate-mini-app.service';
import { DFDegreeRepository } from '@repositories/df-degree.repository';
import { ApplicationRepository } from '@repositories/application.repository';
import { ApplicationProvinceRepository } from '@repositories/application-province.repository';
import { ApplicationJobTypeRepository } from '@repositories/application-job-type.repository';
import { WorkExperienceRepository } from '@repositories/work-experience.repository';
import { ApplicationCareerRepository } from '@repositories/application-career.repository';
import { ApplicationCVRepository } from '@repositories/application-cv.repository';
import { WalletRequirementRepository } from '@repositories/wallet-requirement.repository';
import { DFBankRepository } from '@repositories/df-bank.repository';
import { EducationExperienceRepository } from '@repositories/education-experience.repository';
import { SkillExperienceRepository } from '@repositories/skill-experience.repository';
import { ReferrerRepository } from '@repositories/referrer.repository';
import { MiniAppCandidateModule } from '../mini-app/features/candidate/candidate-mini-app.module';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { NotificationService } from '@services/notification.service';
import { JobTypeRepository } from '@repositories/job-type.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { YearOfExperienceRepository } from '@repositories/year-of-experience.repository';
import { GenderRepository } from '@repositories/gender.repository';
import { AgeGroupRepository } from '@repositories/age-group.repository';
import { SalaryRangeRepository } from '@repositories/salary-range.repository';
import { RecruitmentJobTypeRepository } from '@repositories/recruitment-job-type.repository';
import { FeeOfRecruitmentRequirementRepository } from '@repositories/fee-of-recruitment-requirement.repository';
import { RecruitmentRequirementHistoryRepository } from '@repositories/recruitment-requirement-history.repository';
import { RecruitmentRequirementProvinceRepository } from '@repositories/recruitment-requirement-province.repository';
import { CandidateInterviewRepository } from '@repositories/candidate-interview.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { RecruitmentRequirementImplementationRepository } from '@repositories/recruitment-requirement-implementation.repository';
import { RecruitmentRequirementFileRepository } from '@repositories/recruitment-requirement-file.repository';
import { RecruitmentRequirementHroRepository } from '@repositories/recruitment-requirement-hro.repository';
import { MailService } from '@services/mail.service';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { UserRecruitmentFavoriteRepository } from '@repositories/user-recruitment-favorite.repository';
import { CandidateApplyRepository } from '@repositories/candidate-apply.repository';
import { CandidateApplyFileRepository } from '@repositories/candidate-apply-file.repository';
import { MyGateway } from 'src/shared/gateway/gateway';
import { NotificationRepository } from '@repositories/notification.repository';
import { SocketService } from 'src/shared/gateway/socket.service';
import { AuthMiniAppService } from '../mini-app/features/auth/service/auth-mini-app.service';
import { BankAccountRepository } from '@repositories/bank-account.repository';
import { HashService } from '@services/hash.service';
import { ForgotPasswordRepository } from '@repositories/forgot-password.repository';
import { HroRequestRepository } from '@repositories/hro-request.repository';
import { UserPointRepository } from '@repositories/user-point.repository';
import { UserPointHistoryRepository } from '@repositories/user-point-history.repository';
import { ConfigApprovalHroRepository } from '@repositories/config-approval-hro.repository';
import { CandidateJobTypeRepository } from '@repositories/candidate-job-type.repository';
import { CandidateProvinceRepository } from '@repositories/candidate-province.repository';
import { CandidateInformationFileRepository } from '@repositories/candidate-information-file.repository';
import { UserCareerFavoriteRepository } from '@repositories/user-career-favorite.repository';
import { CandidateInterestService } from '../mini-app/features/candidate-interest/service/candidate-interest.service';
import { CandidateInterestRepository } from '@repositories/candidate-interest.repository';
import { CandidateInterestCareerRepository } from '@repositories/candidate-interest-career.repository';

@Module({
  imports: [FeaturesModule, MiniAppCandidateModule],
  controllers: [CandidateController],
  providers: [
    CandidateService,
    CandidateInformationRepository,
    UserRepository,
    PositionRepository,
    WalletRepository,
    ProfessionalFieldRepository,
    EnterPriseAddressRepository,
    EnterpriseRepository,
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
    RecruitmentRequirementRepository,
    NotificationService,
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
    RecruitmentRequirementImplementationRepository,
    RecruitmentRequirementFileRepository,
    RecruitmentRequirementHroRepository,
    MailService,
    WalletHistoryRepository,
    UserRecruitmentFavoriteRepository,
    CandidateApplyRepository,
    CandidateApplyFileRepository,
    MyGateway,
    NotificationRepository,
    SocketService,
    AuthMiniAppService,
    BankAccountRepository,
    HashService,
    ForgotPasswordRepository,
    HroRequestRepository,
    UserPointRepository,
    UserPointHistoryRepository,
    ConfigApprovalHroRepository,
    CandidateJobTypeRepository,
    CandidateProvinceRepository,
    CandidateInformationFileRepository,
    UserCareerFavoriteRepository,
    CandidateInterestService,
    CandidateInterestRepository,
    CandidateInterestCareerRepository,
  ],
})
export class CandidateModule {}
