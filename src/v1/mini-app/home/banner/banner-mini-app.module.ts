import { Module } from '@nestjs/common';
import { BannerMiniAppController } from './controller/banner-mini-app.controller';
import { BannerMiniAppService } from './service/banner-mini-app.service';
import { BannerRepository } from '@repositories/banner.repository';

@Module({
  controllers: [BannerMiniAppController],
  providers: [BannerMiniAppService, BannerRepository],
})
export class BannerMiniAppModule {}
