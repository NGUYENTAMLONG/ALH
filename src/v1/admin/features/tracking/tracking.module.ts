// Nest dependencies
import { Module } from '@nestjs/common';
// Local files
import { TrackingLogRepository } from '@repositories/tracking-log.repository';
import { UserRepository } from '@repositories/user.repository';
import { AdminTrackingController } from './controller/tracking.controller';
import { AdminTrackingService } from './service/tracking.service';

@Module({
  controllers: [AdminTrackingController],
  providers: [AdminTrackingService, TrackingLogRepository, UserRepository],
})
export class AdminTrackingModule {}
