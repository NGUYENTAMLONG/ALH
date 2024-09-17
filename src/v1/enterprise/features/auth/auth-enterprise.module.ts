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
import { AuthEnterpriseController } from './controller/auth-enterprise.controller';
import { AuthEnterpriseService } from './service/auth-enterprise.service';

@Module({
  imports: [WebsocketModule],
  providers: [
    PositionRepository,
    EnterpriseRepository,
    HashService,
    ForgotPasswordRepository,
    MailService,
    AuthEnterpriseService,
    UserRepository,
    WalletRepository,
    WalletHistoryRepository,
  ],
  controllers: [AuthEnterpriseController],
})
export class AuthEnterpriseModule {}
