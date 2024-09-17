//Nest dependencies
import { Module } from '@nestjs/common';
//Local files
import { FeeTypeRepository } from '@repositories/fee-type.repository';
import { FeeTypeController } from './controller/fee-type.controller';
import { FeeTypeService } from './service/fee-type.service';

@Module({
  controllers: [FeeTypeController],
  providers: [FeeTypeService, FeeTypeRepository],
})
export class FeeTypeModule {}
