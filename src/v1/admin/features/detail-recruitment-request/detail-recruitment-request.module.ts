import { Module } from '@nestjs/common';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateJobTypeRepository } from '@repositories/candidate-job-type.repository';
import { CandidateProvinceRepository } from '@repositories/candidate-province.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { InterestListJobTypeRepository } from '@repositories/interest-list-job-type.repository';
import { InterestListProvinceRepository } from '@repositories/interest-list-province.repository';
import { InterestListTransactionRepository } from '@repositories/interest-list-transaction.repository';
import { InterestListRepository } from '@repositories/interest-list.repository';
import { WebsocketModule } from '@services/module/websocket.module';
import { AdminDetailRecruitmentRequestController } from './controller/admin-detail-recruitment-request.controller';
import { AdminDetailRecruitmentRequestService } from './service/detail-recruitment-request.service';

@Module({
  imports: [WebsocketModule],
  controllers: [AdminDetailRecruitmentRequestController],
  providers: [
    AdminDetailRecruitmentRequestService,
    InterestListRepository,
    InterestListTransactionRepository,
    CandidateInformationRepository,
    EnterpriseRepository,
    CandidateProvinceRepository,
    InterestListProvinceRepository,
    CandidateJobTypeRepository,
    InterestListJobTypeRepository,
  ],
})
export class AdminDetailRecruitmentRequestModule {}
