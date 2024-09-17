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
import { AuthMiniAppController } from './controller/auth-mini-app.controller';
import { AuthMiniAppService } from './service/auth-mini-app.service';
import { ConfigApprovalHroRepository } from '@repositories/config-approval-hro.repository';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateJobTypeRepository } from '@repositories/candidate-job-type.repository';
import { CandidateProvinceRepository } from '@repositories/candidate-province.repository';
import { CandidateInformationFileRepository } from '@repositories/candidate-information-file.repository';
import { UserCareerFavoriteRepository } from '@repositories/user-career-favorite.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { EnterPriseAddressRepository } from '@repositories/enterprise-address.repository';
import { SocketService } from 'src/shared/gateway/socket.service';
import { MyGateway } from 'src/shared/gateway/gateway';

@Module({
  imports: [WebsocketModule],
  providers: [
    AuthMiniAppService,
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
    UserCareerFavoriteRepository,
    EnterpriseRepository,
    EnterPriseAddressRepository,
    MyGateway,
    SocketService,
  ],
  controllers: [AuthMiniAppController],
  exports: [UserRepository],
})
export class AuthMiniAppModule {}
