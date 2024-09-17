//Nest dependencies
import { Module } from '@nestjs/common';
//Local dependencies
import { GenderRepository } from '@repositories/gender.repository';
import { GenderController } from './controller/gender.controller';
import { GenderService } from './service/gender.service';

@Module({
  controllers: [GenderController],
  providers: [GenderService, GenderRepository],
})
export class GenderModule {}
