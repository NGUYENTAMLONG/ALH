// Nest dependencies
import { Module } from '@nestjs/common';

// Local files
import { CandidateInterviewRepository } from '@repositories/candidate-interview.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { EnterPriseAddressRepository } from '@repositories/enterprise-address.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { InterestListRepository } from '@repositories/interest-list.repository';
import { PositionRepository } from '@repositories/position.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { RecruitmentRequirementHroRepository } from '@repositories/recruitment-requirement-hro.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { UserRepository } from '@repositories/user.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { MailService } from '@services/mail.service';
import { EnterpriseController } from './controller/enterprise.controller';
import { EnterpriseService } from './service/enterprise.service';

@Module({
  controllers: [EnterpriseController],
  providers: [
    PositionRepository,
    UserRepository,
    EnterpriseRepository,
    EnterpriseService,
    ProfessionalFieldRepository,
    MailService,
    EnterPriseAddressRepository,
    WalletRepository,
    WalletHistoryRepository,
    InterestListRepository,
    RecruitmentRequirementRepository,
    CandidateRecruitmentRepository,
    CandidateInterviewRepository,
    RecruitmentRequirementHroRepository,
  ],
})
export class EnterpriseAdminModule {}
