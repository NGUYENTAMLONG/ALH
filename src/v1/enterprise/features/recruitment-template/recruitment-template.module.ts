// Nest dependencies
import { Module } from '@nestjs/common';

// Local files
import { RecruitmentTemplateRepository } from '@repositories/recruitment-template.repository';
import { UserRepository } from '@repositories/user.repository';
import { RecruitmentTemplateController } from './controller/recruitment-template.controller';
import { RecruitmentTemplateService } from './service/recruitment-template.service';

@Module({
  controllers: [RecruitmentTemplateController],
  providers: [
    RecruitmentTemplateService,
    RecruitmentTemplateRepository,
    UserRepository,
  ],
})
export class RecruitmentTemplateModule {}
