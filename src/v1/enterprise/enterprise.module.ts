// Nest dependencies
import { Module } from '@nestjs/common';

// Local files
import { EnterPriseAddressRepository } from '@repositories/enterprise-address.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { PositionRepository } from '@repositories/position.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { UserRepository } from '@repositories/user.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { EnterpriseController } from './controller/enterprise.controller';
import { FeaturesModule } from './features/features.module';
import { EnterpriseService } from './service/enterprise.service';

@Module({
  imports: [FeaturesModule],
  controllers: [EnterpriseController],
  providers: [
    EnterpriseService,
    EnterpriseRepository,
    UserRepository,
    PositionRepository,
    ProfessionalFieldRepository,
    EnterPriseAddressRepository,
    WalletRepository,
  ],
})
export class EnterpriseModule {}
