import { Module } from '@nestjs/common';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateInterviewRepository } from '@repositories/candidate-interview.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { InterestListTransactionRepository } from '@repositories/interest-list-transaction.repository';
import { InterestListRepository } from '@repositories/interest-list.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { MailService } from '@services/mail.service';
import { WebsocketModule } from '@services/module/websocket.module';
import { NotificationService } from '@services/notification.service';
import { ScheduleInterviewService } from './schedule-interview.service';
import { UpdateStatusInterestLitsService } from './update-status-interest-list.service';

@Module({
  imports: [WebsocketModule],
  providers: [
    UpdateStatusInterestLitsService,
    InterestListRepository,
    InterestListTransactionRepository,
    ScheduleInterviewService,
    CandidateInterviewRepository,
    CandidateInformationRepository,
    RecruitmentRequirementRepository,
    CandidateRecruitmentRepository,
    NotificationService,
    DFProvinceRepository,
    MailService,
  ],
})
export class TasksModule {}
