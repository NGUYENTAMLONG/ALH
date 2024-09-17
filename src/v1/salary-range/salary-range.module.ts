//Nest dependencies
import { Module } from '@nestjs/common';
//Local dependencies
import { SalaryRangeController } from './controller/salary-range.controller';
import { SalaryRangeService } from './service/salary-range.service';
import { SalaryRangeRepository } from '@repositories/salary-range.repository';

@Module({
  controllers: [SalaryRangeController],
  providers: [SalaryRangeService, SalaryRangeRepository],
})
export class SalaryRangeModule {}
