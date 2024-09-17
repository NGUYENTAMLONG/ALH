import { Module } from '@nestjs/common';
import { UserRepository } from '@repositories/user.repository';
import { AdminBannerController } from './controller/banner.controller';
import { AdminBannerService } from './service/banner.service';
import { BannerRepository } from '@repositories/banner.repository';

@Module({
  controllers: [AdminBannerController],
  providers: [AdminBannerService, BannerRepository, UserRepository],
})
export class AdminBannerModule {}
