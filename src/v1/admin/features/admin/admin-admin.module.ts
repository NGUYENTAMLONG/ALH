// Nest dependencies
import { Module } from '@nestjs/common';
import { BankAccountRepository } from '@repositories/bank-account.repository';
import { HroRequestRepository } from '@repositories/hro-request.repository';
import { RecruitmentRequirementHroRepository } from '@repositories/recruitment-requirement-hro.repository';
import { RecruitmentRequirementImplementationRepository } from '@repositories/recruitment-requirement-implementation.repository';
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { UserPointHistoryRepository } from '@repositories/user-point-history.repository';
import { UserPointRepository } from '@repositories/user-point.repository';
import { UserRepository } from '@repositories/user.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { MailService } from '@services/mail.service';
import { AdminAdminController } from './controller/admin-admin.controller';
import { AdminAdminService } from './service/admin-admin.service';

// Other dependencies

@Module({
  controllers: [AdminAdminController],
  providers: [
    AdminAdminService,
    UserRepository,
    BankAccountRepository,
    MailService,
    WalletRepository,
    WalletHistoryRepository,
    UserPointRepository,
    UserPointHistoryRepository,
    RecruitmentRequirementRepository,
    RecruitmentRequirementHroRepository,
    HroRequestRepository,
    RecruitmentRequirementImplementationRepository,
  ],
})
export class AdminAdminModule {}
