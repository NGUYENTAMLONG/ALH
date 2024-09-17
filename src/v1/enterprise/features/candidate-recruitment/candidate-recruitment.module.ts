import { Module } from '@nestjs/common';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { RecruitmentRequirementHistoryRepository } from '@repositories/recruitment-requirement-history.repository';
import { RecruitmentRequirementImplementationRepository } from '@repositories/recruitment-requirement-implementation.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { UserRepository } from '@repositories/user.repository';
import { MailService } from '@services/mail.service';
import { WebsocketModule } from '@services/module/websocket.module';
import { EnterpriseCandidateRecruitmentController } from './controller/candidate-recruitment.controller';
import { EnterpriseCandidateRecruitmentService } from './service/candidate-recruitment.service';

@Module({
  imports: [WebsocketModule],
  controllers: [EnterpriseCandidateRecruitmentController],
  providers: [
    EnterpriseCandidateRecruitmentService,
    CandidateRecruitmentRepository,
    EnterpriseRepository,
    UserRepository,
    CandidateInformationRepository,
    RecruitmentRequirementRepository,
    RecruitmentRequirementImplementationRepository,
    MailService,
    RecruitmentRequirementHistoryRepository,
  ],
})
export class EnterpriseCandidateRecruitmentModule {}
