//Nest dependencies
import { Module } from '@nestjs/common';
//Local files
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { RecruitmentRequestFileRepository } from '@repositories/recruitment-request-file.repository';
import { WebsocketModule } from '@services/module/websocket.module';
import { WalletRequirementRepository } from '@repositories/wallet-requirement.repository';
import { AdminWalletRequirementController } from './controller/admin-wallet-requirement.controller';
import { AdminWalletRequirementService } from './service/admin-wallet-requirement.service';

@Module({
  imports: [WebsocketModule],
  controllers: [AdminWalletRequirementController],
  providers: [
    AdminWalletRequirementService,
    RecruitmentRequestFileRepository,
    EnterpriseRepository,
    WalletRequirementRepository,
  ],
})
export class AdminWalletRequirementModule {}
