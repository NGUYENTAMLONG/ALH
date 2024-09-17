import { Module } from '@nestjs/common';
import { DFCareerController } from './controller/df-career.controller';
import { DFCareerService } from './service/df-career.service';
import { DFCareerRepository } from '@repositories/df-career.repository';
import { DFGroupCareerRepository } from '@repositories/df-district.repository copy';

@Module({
  controllers: [DFCareerController],
  providers: [DFCareerService, DFCareerRepository, DFGroupCareerRepository],
})
export class DFCareerModule {}
