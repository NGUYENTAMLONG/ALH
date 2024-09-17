import { Module } from '@nestjs/common';
import { DFDegreeService } from './service/df-degree.service';
import { DFDegreeController } from './controller/df-degree.controller';
import { DFDegreeRepository } from '@repositories/df-degree.repository';

@Module({
  controllers: [DFDegreeController],
  providers: [DFDegreeService, DFDegreeRepository],
})
export class DFDegreeModule {}
