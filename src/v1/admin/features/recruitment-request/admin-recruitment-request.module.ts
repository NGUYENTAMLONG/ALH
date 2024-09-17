// Nest dependencies
import { Module } from '@nestjs/common';
// Local files
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateProvinceRepository } from '@repositories/candidate-province.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { InterestListProvinceRepository } from '@repositories/interest-list-province.repository';
import { InterestListTransactionRepository } from '@repositories/interest-list-transaction.repository';
import { InterestListRepository } from '@repositories/interest-list.repository';
import { WebsocketModule } from '@services/module/websocket.module';
import { AdminRecruitmentRequestController } from './controller/admin-recruitment-request.controller';
import { AdminRecruitmentRequestService } from './service/admin-recruitment-request.service';

@Module({
  imports: [WebsocketModule],
  controllers: [AdminRecruitmentRequestController],
  providers: [
    AdminRecruitmentRequestService,
    InterestListRepository,
    EnterpriseRepository,
    CandidateInformationRepository,
    InterestListTransactionRepository,
    CandidateProvinceRepository,
    InterestListProvinceRepository,
  ],
})
export class AdminRecruitmentRequestModule {}
