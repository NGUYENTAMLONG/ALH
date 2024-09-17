// Nest dependencies
import { Module } from '@nestjs/common';

// Local files
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { ForgotPasswordRepository } from '@repositories/forgot-password.repository';
import { PositionRepository } from '@repositories/position.repository';
import { UserRepository } from '@repositories/user.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { HashService } from '@services/hash.service';
import { MailService } from '@services/mail.service';
import { WebsocketModule } from '@services/module/websocket.module';
import { AuthCandidateController } from './controller/auth-candidate.controller';
import { AuthCandidateService } from './service/auth-candidate.service';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateInformationFileRepository } from '@repositories/candidate-information-file.repository';
import { CandidateProvinceRepository } from '@repositories/candidate-province.repository';
import { CandidateInterestRepository } from '@repositories/candidate-interest.repository';
import { CandidateInterestCareerRepository } from '@repositories/candidate-interest-career.repository';

@Module({
  imports: [WebsocketModule],
  providers: [
    PositionRepository,
    EnterpriseRepository,
    HashService,
    ForgotPasswordRepository,
    MailService,
    AuthCandidateService,
    UserRepository,
    WalletRepository,
    WalletHistoryRepository,
    CandidateInformationRepository,
    CandidateInformationFileRepository,
    CandidateProvinceRepository,
    CandidateInterestRepository,
    CandidateInterestCareerRepository,
  ],
  controllers: [AuthCandidateController],
})
export class AuthCandidateModule {}
