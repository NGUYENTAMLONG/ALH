// Nest dependencies
import { Module } from '@nestjs/common';
import { EnterpriseAdminModule } from 'src/v1/admin/features/enterprise/enterprise.module';
import { AdminPositionModule } from 'src/v1/admin/features/position/position.module';
import { AdminProfessionalFieldModule } from 'src/v1/admin/features/professional-field/professional-field.module';
import { AuthMiniAppModule } from './auth/auth-mini-app.module';
import { AdminCandidateModule } from 'src/v1/admin/features/candidate/candidate.module';
import { RecruitmentTemplateModule } from '@enterprise/features/recruitment-template/recruitment-template.module';
import { AdminRecruitmentRequestModule } from 'src/v1/admin/features/recruitment-request/admin-recruitment-request.module';
import { AdminRecruitmentModule } from 'src/v1/admin/features/recruitment/admin-recruitment.module';
import { AdminDetailRecruitmentRequestModule } from 'src/v1/admin/features/detail-recruitment-request/detail-recruitment-request.module';
import { AdminRecruitmentRequirementModule } from 'src/v1/admin/features/recruitment-requirement/recruitment-requirement.module';
import { AdminUserDataFieldModule } from 'src/v1/admin/features/user-data-field/user-data-field.module';
import { AdminEnterpriseDataFieldModule } from 'src/v1/admin/features/enterprise-data-field/enterprise-data-field.module';
import { AdminCandidateRecruitmentModule } from 'src/v1/admin/features/candidate-recruitment/candidate-recruitment.module';
import { AdminTrackingModule } from 'src/v1/admin/features/tracking/tracking.module';
import { AdminScheduleInterviewModule } from 'src/v1/admin/features/schedule-interview/schedule-interview.module';
import { AdminWalletModule } from 'src/v1/admin/features/wallet/wallet.module';
import { AdminAdminModule } from 'src/v1/admin/features/admin/admin-admin.module';
import { AdminHROModule } from 'src/v1/admin/features/hro/admin-hro.module';
import { AdminConfigPointHroModule } from 'src/v1/admin/features/config-point-hro/config-point-hro.module';
import { AdminUserPointModule } from 'src/v1/admin/features/user-point/user-point.module';
import { AdminHireRequirementModule } from 'src/v1/admin/features/hire-requirement/hire-requirement.module';
import { AdminCandidateHireRequirementModule } from 'src/v1/admin/features/candidate-hire-requirement/candidate-hire-requirement.module';
import { AdminConfigApprovalHroModule } from 'src/v1/admin/features/config-approval-hro/config-point-hro.module';
import { MiniAppRecruitmentModule } from './recruitment/recruitment.module';
import { MiniAppCandidateModule } from './candidate/candidate-mini-app.module';
import { CandidateInterestModule } from './candidate-interest/candidate-interest.module';
import { MiniAppHRModule } from './hr/hr.module';
// Local files

@Module({
  imports: [
    AdminProfessionalFieldModule,
    AdminPositionModule,
    EnterpriseAdminModule,
    AuthMiniAppModule,
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
    MiniAppRecruitmentModule,
    MiniAppCandidateModule,
    CandidateInterestModule,
    MiniAppHRModule,
  ],
  exports: [AuthMiniAppModule],
})
export class FeaturesModule {}
