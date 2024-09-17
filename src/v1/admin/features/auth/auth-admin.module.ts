// Nest dependencies
import { Module } from '@nestjs/common';

// Other dependencies
import { BankAccountRepository } from '@repositories/bank-account.repository';
import { ForgotPasswordRepository } from '@repositories/forgot-password.repository';
import { HroRequestRepository } from '@repositories/hro-request.repository';
import { UserPointHistoryRepository } from '@repositories/user-point-history.repository';
import { UserPointRepository } from '@repositories/user-point.repository';
import { UserRepository } from '@repositories/user.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { HashService } from '@services/hash.service';
import { MailService } from '@services/mail.service';
import { WebsocketModule } from '@services/module/websocket.module';
import { AuthAdminController } from './controller/auth-admin.controller';
import { AuthAdminService } from './service/auth-admin.service';
import { ConfigApprovalHroRepository } from '@repositories/config-approval-hro.repository';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateJobTypeRepository } from '@repositories/candidate-job-type.repository';
import { CandidateProvinceRepository } from '@repositories/candidate-province.repository';
import { CandidateInformationFileRepository } from '@repositories/candidate-information-file.repository';

@Module({
  imports: [WebsocketModule],
  providers: [
    AuthAdminService,
    UserRepository,
    BankAccountRepository,
    HashService,
    ForgotPasswordRepository,
    MailService,
    HroRequestRepository,
    WalletHistoryRepository,
    WalletRepository,
    UserPointRepository,
    UserPointHistoryRepository,
    ConfigApprovalHroRepository,
    CandidateInformationRepository,
    CandidateJobTypeRepository,
    CandidateProvinceRepository,
    CandidateInformationFileRepository,
  ],
  controllers: [AuthAdminController],
  exports: [UserRepository],
})
export class AuthAdminModule {}
