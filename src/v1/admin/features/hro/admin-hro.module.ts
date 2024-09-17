// Nest dependencies
import { Module } from '@nestjs/common';
import { BankAccountRepository } from '@repositories/bank-account.repository';
import { HroRequestRepository } from '@repositories/hro-request.repository';
import { UserRepository } from '@repositories/user.repository';
import { MailService } from '@services/mail.service';
import { AdminHROController } from './controller/admin-hro.controller';
import { AdminHROService } from './service/admin-hro.service';

// Other dependencies

@Module({
  controllers: [AdminHROController],
  providers: [
    AdminHROService,
    UserRepository,
    BankAccountRepository,
    MailService,
    HroRequestRepository,
  ],
})
export class AdminHROModule {}
