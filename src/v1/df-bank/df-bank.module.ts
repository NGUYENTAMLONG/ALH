import { Module } from '@nestjs/common';
import { DFBankRepository } from '@repositories/df-bank.repository';
import { DFBankController } from './controller/df-bank.controller';
import { DFBankService } from './service/df-bank.service';

@Module({
  controllers: [DFBankController],
  providers: [DFBankService, DFBankRepository],
})
export class DFBankModule {}
