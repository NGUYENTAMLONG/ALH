import { Module } from '@nestjs/common';
import { PositionRepository } from '@repositories/position.repository';
import { UserRepository } from '@repositories/user.repository';
import { AdminPositionController } from './controller/position.controller';
import { AdminPositionService } from './service/position.service';

@Module({
  controllers: [AdminPositionController],
  providers: [AdminPositionService, PositionRepository, UserRepository],
})
export class AdminPositionModule {}
