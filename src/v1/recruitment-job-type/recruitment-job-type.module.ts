import { Module } from '@nestjs/common';
import { RecruitmentJobTypeRepository } from '@repositories/recruitment-job-type.repository';
import { RecruitmentJobTypeController } from './controller/recruitment-job-type.controller';
import { RecruitmentJobTypeService } from './service/recruitment-job-type.service';

@Module({
  controllers: [RecruitmentJobTypeController],
  providers: [RecruitmentJobTypeService, RecruitmentJobTypeRepository],
})
export class RecruitmentJobTypeModule {}
