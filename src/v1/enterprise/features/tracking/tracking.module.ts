// Nest dependencies
import { Module } from '@nestjs/common';
// Local files
import { AgeGroupRepository } from '@repositories/age-group.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { GenderRepository } from '@repositories/gender.repository';
import { JobTypeRepository } from '@repositories/job-type.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { TrackingLogRepository } from '@repositories/tracking-log.repository';
import { YearOfExperienceRepository } from '@repositories/year-of-experience.repository';
import { MailService } from '@services/mail.service';
import { WebsocketModule } from '@services/module/websocket.module';
import { EnterpriseTrackingController } from './controller/tracking.controller';
import { EnterpriseTrackingService } from './service/tracking.service';

@Module({
  imports: [WebsocketModule],
  controllers: [EnterpriseTrackingController],
  providers: [
    EnterpriseTrackingService,
    TrackingLogRepository,
    AgeGroupRepository,
    DFProvinceRepository,
    ProfessionalFieldRepository,
    GenderRepository,
    JobTypeRepository,
    YearOfExperienceRepository,
    MailService,
    EnterpriseRepository,
  ],
})
export class EnterpriseTrackingModule {}
