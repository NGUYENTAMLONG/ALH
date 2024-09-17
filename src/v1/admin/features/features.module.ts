// Nest dependencies
import { Module } from '@nestjs/common';
// Local files
import { AdminAdminModule } from './admin/admin-admin.module';
import { AuthAdminModule } from './auth/auth-admin.module';
import { AdminCandidateHireRequirementModule } from './candidate-hire-requirement/candidate-hire-requirement.module';
import { AdminCandidateRecruitmentModule } from './candidate-recruitment/candidate-recruitment.module';
import { AdminCandidateModule } from './candidate/candidate.module';
import { AdminConfigPointHroModule } from './config-point-hro/config-point-hro.module';
import { AdminDetailRecruitmentRequestModule } from './detail-recruitment-request/detail-recruitment-request.module';
import { AdminEnterpriseDataFieldModule } from './enterprise-data-field/enterprise-data-field.module';
import { EnterpriseAdminModule } from './enterprise/enterprise.module';
import { AdminHireRequirementModule } from './hire-requirement/hire-requirement.module';
import { AdminHROModule } from './hro/admin-hro.module';
import { AdminPositionModule } from './position/position.module';
import { AdminProfessionalFieldModule } from './professional-field/professional-field.module';
import { AdminRecruitmentRequestModule } from './recruitment-request/admin-recruitment-request.module';
import { AdminRecruitmentRequirementModule } from './recruitment-requirement/recruitment-requirement.module';
import { RecruitmentTemplateModule } from './recruitment-template/recruitment-template.module';
import { AdminRecruitmentModule } from './recruitment/admin-recruitment.module';
import { AdminScheduleInterviewModule } from './schedule-interview/schedule-interview.module';
import { AdminTrackingModule } from './tracking/tracking.module';
import { AdminUserDataFieldModule } from './user-data-field/user-data-field.module';
import { AdminUserPointModule } from './user-point/user-point.module';
import { AdminWalletModule } from './wallet/wallet.module';
import { AdminConfigApprovalHroModule } from './config-approval-hro/config-point-hro.module';
import { AdminBannerModule } from './banner/banner.module';
import { AdminWalletRequirementModule } from './wallet-requirement/admin-wallet-requirement.module';

@Module({
  imports: [
    AdminProfessionalFieldModule,
    AdminPositionModule,
    EnterpriseAdminModule,
    AuthAdminModule,
    AdminCandidateModule,
    RecruitmentTemplateModule,
    AdminRecruitmentRequestModule,
    AdminRecruitmentModule,
    AdminDetailRecruitmentRequestModule,
    AdminRecruitmentRequirementModule,
    AdminUserDataFieldModule,
    AdminEnterpriseDataFieldModule,
    AdminCandidateRecruitmentModule,
    AdminTrackingModule,
    AdminScheduleInterviewModule,
    AdminWalletModule,
    AdminAdminModule,
    AdminHROModule,
    AdminConfigPointHroModule,
    AdminUserPointModule,
    AdminHireRequirementModule,
    AdminCandidateHireRequirementModule,
    AdminConfigApprovalHroModule,
    AdminBannerModule,
    AdminWalletRequirementModule,
  ],
  exports: [AuthAdminModule],
})
export class FeaturesModule {}
