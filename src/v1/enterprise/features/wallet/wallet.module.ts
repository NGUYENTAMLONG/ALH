// Nest dependencies
import { Module } from '@nestjs/common';
// Local files
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { UserRepository } from '@repositories/user.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { EnterpriseWalletController } from './controller/wallet.controller';
import { EnterpriseWalletService } from './service/wallet.service';

@Module({
  controllers: [EnterpriseWalletController],
  providers: [
    EnterpriseWalletService,
    EnterpriseRepository,
    WalletHistoryRepository,
    WalletRepository,
    UserRepository,
  ],
})
export class EnterpriseWalletModule {}
