// Nest dependencies
import { Module } from '@nestjs/common';

// Local files
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { FeeOfRecruitmentRequirementRepository } from '@repositories/fee-of-recruitment-requirement.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { UserRepository } from '@repositories/user.repository';
import { UploadJdController } from './controller/upload-jd.controller';
import { UploadJdService } from './service/upload-jd.service';

@Module({
  controllers: [UploadJdController],
  providers: [
    UploadJdService,
    EnterpriseRepository,
    RecruitmentRequirementRepository,
    FeeOfRecruitmentRequirementRepository,
    UserRepository,
  ],
})
export class UploadJdModule {}
