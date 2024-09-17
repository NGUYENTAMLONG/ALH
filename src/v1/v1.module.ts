// Nest dependencies
import { Module } from '@nestjs/common';

// Local files
import { EnterpriseModule } from '@enterprise/enterprise.module';
import { AddressModule } from './address/address.module';
import { AdminModule } from './admin/admin.module';
import { AgeGroupModule } from './age-group/age-group.module';
import { DFBankModule } from './df-bank/df-bank.module';
import { FeeTypeModule } from './fee-type/fee-type.module';
import { GenderModule } from './gender/gender.module';
import { JobTypeModule } from './job-type/job-type.module';
import { NotificationModule } from './notification/notification.module';
import { PositionModule } from './position/position.module';
import { ProfessionalFieldModule } from './professional-field/professional-field.module';
import { RecruitmentJobTypeModule } from './recruitment-job-type/recruitment-job-type.module';
import { SalaryRangeModule } from './salary-range/salary-range.module';
import { UploadFileModule } from './upload-file/upload-file.module';
import { YearOfExperienceModule } from './year-of-experience/year-of-experience.module';
import { MiniAppModule } from './mini-app/mini-app.module';
import { DFCareerModule } from './df-career/df-career.module';
import { DFDegreeModule } from './df-degree/df-degree.module';
import { CronModule } from './cronjob/cron.module';
import { testZaloMessage } from '@utils/send-zalo-message';
import { CandidateModule } from './candidate/candidate.module';

// (() =>
//   testZaloMessage({
//     messages: [],
//   }))();
@Module({
  imports: [
    EnterpriseModule,
    AdminModule,
    MiniAppModule,
    AddressModule,
    ProfessionalFieldModule,
    AgeGroupModule,
    YearOfExperienceModule,
    SalaryRangeModule,
    JobTypeModule,
    UploadFileModule,
    RecruitmentJobTypeModule,
    NotificationModule,
    PositionModule,
    GenderModule,
    FeeTypeModule,
    DFBankModule,
    DFCareerModule,
    DFDegreeModule,
    CronModule,
    CandidateModule,
  ],
  controllers: [],
  exports: [AdminModule],
})
export class V1Module {}
