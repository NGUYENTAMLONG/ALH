//Nest dependencies
import { Module } from '@nestjs/common';
//Local dependencies
import { JobTypeController } from './controller/job-type.controller';
import { JobTypeService } from './service/job-type.service';
import { JobTypeRepository } from '@repositories/job-type.repository';

@Module({
  controllers: [JobTypeController],
  providers: [JobTypeService, JobTypeRepository],
})
export class JobTypeModule {}
