import { Module } from '@nestjs/common';
import { AgeGroupController } from './controller/age-group.controller';
import { AgeGroupService } from './service/age-group.service';
import { AgeGroupRepository } from '@repositories/age-group.repository';

@Module({
  controllers: [AgeGroupController],
  providers: [AgeGroupService, AgeGroupRepository],
})
export class AgeGroupModule {}
