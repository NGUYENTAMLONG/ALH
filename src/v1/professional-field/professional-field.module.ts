import { Module } from '@nestjs/common';
import { ProfessionalFieldController } from './controller/professional-field.controller';
import { ProfessionalFieldService } from './service/professional-field.service';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';

@Module({
  controllers: [ProfessionalFieldController],
  providers: [ProfessionalFieldService, ProfessionalFieldRepository],
})
export class ProfessionalFieldModule {}
