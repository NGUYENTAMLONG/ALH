import { Module } from '@nestjs/common';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { UserRepository } from '@repositories/user.repository';
import { AdminProfessionalFieldController } from './controller/professional-field.controller';
import { AdminProfessionalFieldService } from './service/professional-field.service';

@Module({
  controllers: [AdminProfessionalFieldController],
  providers: [
    AdminProfessionalFieldService,
    ProfessionalFieldRepository,
    UserRepository,
  ],
})
export class AdminProfessionalFieldModule {}
