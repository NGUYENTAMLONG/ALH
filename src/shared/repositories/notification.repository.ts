// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { Notification } from '@models/notification.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class NotificationRepository extends BaseRepository<Notification> {
  constructor() {
    super(Notification);
  }
}
