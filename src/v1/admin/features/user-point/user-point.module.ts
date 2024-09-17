// Nest dependencies
import { Module } from '@nestjs/common';
// Local files
import { UserPointHistoryRepository } from '@repositories/user-point-history.repository';
import { UserPointRepository } from '@repositories/user-point.repository';
import { MailService } from '@services/mail.service';
import { WebsocketModule } from '@services/module/websocket.module';
import { AdminUserPointController } from './controller/user-point.controller';
import { AdminUserPointService } from './service/user-point.service';

@Module({
  imports: [WebsocketModule],
  controllers: [AdminUserPointController],
  providers: [
    AdminUserPointService,
    UserPointRepository,
    UserPointHistoryRepository,
    MailService,
  ],
})
export class AdminUserPointModule {}
