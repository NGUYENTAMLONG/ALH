// Nest dependencies
import { Module } from '@nestjs/common';

// Local files
import { AuthEnterpriseModule } from './auth/auth-enterprise.module';
import { EnterpriseCandidateHireRequirementModule } from './candidate-hire-requirement/candidate-hire-requirement.module';
import { EnterpriseCandidateRecruitmentModule } from './candidate-recruitment/candidate-recruitment.module';
import { EnterpriseCandidateModule } from './candidate/enterprise-candidate.module';
import { EnterpriseHireRequirementModule } from './hire-requirement/hire-requirement.module';
import { EnterpriseInterestListModule } from './interest-list/interest-list.module';
import { RecruitmentTemplateModule } from './recruitment-template/recruitment-template.module';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { EnterpriseTrackingModule } from './tracking/tracking.module';
import { UploadJdModule } from './upload-jd/upload-jd.module';
import { EnterpriseWalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    AuthEnterpriseModule,
    UploadJdModule,
    RecruitmentModule,
    RecruitmentTemplateModule,
    EnterpriseCandidateModule,
    EnterpriseInterestListModule,
    EnterpriseTrackingModule,
    EnterpriseCandidateRecruitmentModule,
    EnterpriseWalletModule,
    EnterpriseHireRequirementModule,
    EnterpriseCandidateHireRequirementModule,
  ],
})
export class FeaturesModule {}
