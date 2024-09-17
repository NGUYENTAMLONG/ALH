// Nest dependencies
import { Module } from '@nestjs/common';
// Local files
import { AgeGroupRepository } from '@repositories/age-group.repository';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateJobTypeRepository } from '@repositories/candidate-job-type.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { InterestListTransactionRepository } from '@repositories/interest-list-transaction.repository';
import { InterestListRepository } from '@repositories/interest-list.repository';
import { WebsocketModule } from '@services/module/websocket.module';
import { EnterpriseInterestListController } from './controller/interest-list.controller';
import { EnterpriseInterestListService } from './service/interest-list.service';

@Module({
  imports: [WebsocketModule],
  controllers: [EnterpriseInterestListController],
  providers: [
    InterestListRepository,
    EnterpriseRepository,
    EnterpriseInterestListService,
    InterestListTransactionRepository,
    CandidateInformationRepository,
    CandidateJobTypeRepository,
    AgeGroupRepository,
  ],
})
export class EnterpriseInterestListModule {}
