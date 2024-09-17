// Nest dependencies
import { Module } from '@nestjs/common';
// Local files
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { MailService } from '@services/mail.service';
import { WebsocketModule } from '@services/module/websocket.module';
import { NotificationService } from '@services/notification.service';
import { AdminWalletController } from './controller/wallet.controller';
import { AdminWalletService } from './service/wallet.service';

@Module({
  imports: [WebsocketModule],
  controllers: [AdminWalletController],
  providers: [
    AdminWalletService,
    WalletRepository,
    WalletHistoryRepository,
    EnterpriseRepository,
    NotificationService,
    MailService,
  ],
})
export class AdminWalletModule {}
