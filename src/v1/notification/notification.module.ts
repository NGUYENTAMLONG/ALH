//Nest dependencies
import { Module } from '@nestjs/common';
// Local files
import { NotificationRepository } from '@repositories/notification.repository';
import { UserRepository } from '@repositories/user.repository';
import { NotificationController } from './controller/notification.controller';
import { DfNotificationService } from './service/notification.service';

@Module({
  controllers: [NotificationController],
  providers: [DfNotificationService, NotificationRepository, UserRepository],
})
export class NotificationModule {}
