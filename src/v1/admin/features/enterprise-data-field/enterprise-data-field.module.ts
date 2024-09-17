import { Module } from '@nestjs/common';
import { EnterpriseDataFieldSourceRepository } from '@repositories/enterprise-data-field-source.repository';
import { EnterpriseDataFieldRepository } from '@repositories/enterprise-data-field.repository';
import { EnterpriseDataRepository } from '@repositories/enterprise-data.repository';
import { UserRepository } from '@repositories/user.repository';
import { AdminEnterpriseDataFieldController } from './controller/enterprise-data-field.controller';
import { AdminEnterpriseDataFieldService } from './service/enterprise-data-field.service';
@Module({
  controllers: [AdminEnterpriseDataFieldController],
  providers: [
    AdminEnterpriseDataFieldService,
    EnterpriseDataFieldRepository,
    EnterpriseDataFieldSourceRepository,
    EnterpriseDataRepository,
    UserRepository,
  ],
})
export class AdminEnterpriseDataFieldModule {}
