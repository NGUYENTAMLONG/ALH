//Nest dependencies
import { Module } from '@nestjs/common';
// Local files
import { PositionRepository } from '@repositories/position.repository';
import { PositionController } from './controller/position.controller';
import { PositionService } from './service/position.service';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';

@Module({
  controllers: [PositionController],
  providers: [PositionService, PositionRepository, ProfessionalFieldRepository],
})
export class PositionModule {}
