import { Module } from '@nestjs/common';
import { AdminConfigPointHroController } from './controller/config-approval-hro.controller';
import { AdminConfigApprovalHroService } from './service/config-approval-hro.service';
import { ConfigApprovalHroRepository } from '@repositories/config-approval-hro.repository';

@Module({
  controllers: [AdminConfigPointHroController],
  providers: [AdminConfigApprovalHroService, ConfigApprovalHroRepository],
})
export class AdminConfigApprovalHroModule {}
