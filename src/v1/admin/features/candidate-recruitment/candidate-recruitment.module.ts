import { Module } from '@nestjs/common';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateInterviewRepository } from '@repositories/candidate-interview.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { ConfigPointHroRepository } from '@repositories/config-point-hro.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { FeeOfRecruitmentRequirementRepository } from '@repositories/fee-of-recruitment-requirement.repository';
import { RecruitmentRequirementHistoryRepository } from '@repositories/recruitment-requirement-history.repository';
import { RecruitmentRequirementHroRepository } from '@repositories/recruitment-requirement-hro.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { UserPointHistoryRepository } from '@repositories/user-point-history.repository';
import { UserPointRepository } from '@repositories/user-point.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { MailService } from '@services/mail.service';
import { WebsocketModule } from '@services/module/websocket.module';
import { NotificationService } from '@services/notification.service';
import { AdminCandidateRecruitmentController } from './controller/candidate-recruitment.controller';
import { AdminCandidateRecruitmentService } from './service/candidate-recruitment.service';

@Module({
  imports: [WebsocketModule],
  controllers: [AdminCandidateRecruitmentController],
  providers: [
    AdminCandidateRecruitmentService,
    CandidateRecruitmentRepository,
    CandidateInformationRepository,
    RecruitmentRequirementRepository,
    FeeOfRecruitmentRequirementRepository,
    CandidateInterviewRepository,
    RecruitmentRequirementHistoryRepository,
    WalletRepository,
    WalletHistoryRepository,
    NotificationService,
    MailService,
    DFProvinceRepository,
    RecruitmentRequirementHroRepository,
    ConfigPointHroRepository,
    UserPointRepository,
    UserPointHistoryRepository,
  ],
})
export class AdminCandidateRecruitmentModule {}
