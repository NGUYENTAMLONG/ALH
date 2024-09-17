import { Module } from '@nestjs/common';
import { NotificationRepository } from '@repositories/notification.repository';
import { UserRepository } from '@repositories/user.repository';
import { NotificationService } from '@services/notification.service';
import { MyGateway } from 'src/shared/gateway/gateway';
import { SocketService } from 'src/shared/gateway/socket.service';

@Module({
  providers: [
    NotificationService,
    MyGateway,
    UserRepository,
    NotificationRepository,
    SocketService,
  ],
  exports: [
    NotificationService,
    MyGateway,
    UserRepository,
    NotificationRepository,
  ],
})
export class WebsocketModule {}
