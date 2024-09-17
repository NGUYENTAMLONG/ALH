// Nest dependencies
import { Module } from '@nestjs/common';

// Local files
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateInterviewRepository } from '@repositories/candidate-interview.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { RecruitmentRequirementImplementationRepository } from '@repositories/recruitment-requirement-implementation.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { UserRepository } from '@repositories/user.repository';
import { MailService } from '@services/mail.service';
import { WebsocketModule } from '@services/module/websocket.module';
import { NotificationService } from '@services/notification.service';
import { AdminScheduleInterviewController } from './controller/schedule-interview.controller.';
import { AdminScheduleInterviewService } from './service/schedule-interview.service';

@Module({
  imports: [WebsocketModule],
  controllers: [AdminScheduleInterviewController],
  providers: [
    AdminScheduleInterviewService,
    CandidateRecruitmentRepository,
    CandidateInterviewRepository,
    CandidateInformationRepository,
    DFProvinceRepository,
    RecruitmentRequirementRepository,
    UserRepository,
    RecruitmentRequirementImplementationRepository,
    NotificationService,
    MailService,
  ],
})
export class AdminScheduleInterviewModule {}
