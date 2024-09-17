//Nest dependencies
import { Module } from '@nestjs/common';
//Local files
import { AgeGroupRepository } from '@repositories/age-group.repository';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateJobTypeRepository } from '@repositories/candidate-job-type.repository';
import { CandidateProvinceRepository } from '@repositories/candidate-province.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { EnterPriseAddressRepository } from '@repositories/enterprise-address.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { HirePriceRepository } from '@repositories/hire-price.repository';
import { InterestListJobTypeRepository } from '@repositories/interest-list-job-type.repository';
import { InterestListProvinceRepository } from '@repositories/interest-list-province.repository';
import { InterestListTransactionRepository } from '@repositories/interest-list-transaction.repository';
import { InterestListRepository } from '@repositories/interest-list.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { WebsocketModule } from '@services/module/websocket.module';
import { EnterpriseCandidateController } from './controller/enterprise-candidate.controller';
import { EnterpriseCandidateService } from './service/enterprise-candidate.service';

@Module({
  imports: [WebsocketModule],
  controllers: [EnterpriseCandidateController],
  providers: [
    EnterpriseCandidateService,
    CandidateInformationRepository,
    AgeGroupRepository,
    InterestListRepository,
    HirePriceRepository,
    ProfessionalFieldRepository,
    EnterPriseAddressRepository,
    EnterpriseRepository,
    CandidateJobTypeRepository,
    InterestListTransactionRepository,
    CandidateProvinceRepository,
    InterestListProvinceRepository,
    InterestListJobTypeRepository,
    CandidateRecruitmentRepository,
  ],
})
export class EnterpriseCandidateModule {}
