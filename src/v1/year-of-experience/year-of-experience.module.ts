import { Module } from '@nestjs/common';
import { YearOfExperienceController } from './controller/year-of-experience.controller';
import { YearOfExperienceService } from './service/year-of-experience.service';
import { YearOfExperienceRepository } from '@repositories/year-of-experience.repository';

@Module({
  controllers: [YearOfExperienceController],
  providers: [YearOfExperienceService, YearOfExperienceRepository],
})
export class YearOfExperienceModule {}
