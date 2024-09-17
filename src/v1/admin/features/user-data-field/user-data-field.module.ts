//Nest dependencies
import { Module } from '@nestjs/common';
import { UserDataFieldSourceRepository } from '@repositories/user-data-field-source.repository';
import { UserDataFieldRepository } from '@repositories/user-data-field.repository';
import { UserDataRepository } from '@repositories/user-data.repository';
import { UserRepository } from '@repositories/user.repository';
import { AdminUserDataFieldController } from './controller/user-data-field.controller';
import { AdminUserDataFieldService } from './service/user-data-field.service';
@Module({
  controllers: [AdminUserDataFieldController],
  providers: [
    AdminUserDataFieldService,
    UserDataFieldRepository,
    UserDataFieldSourceRepository,
    UserDataRepository,
    UserRepository,
  ],
})
export class AdminUserDataFieldModule {}
