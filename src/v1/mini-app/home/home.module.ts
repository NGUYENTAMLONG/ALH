// Nest dependencies
import { Module } from '@nestjs/common';
import { BannerMiniAppModule } from './banner/banner-mini-app.module';
import { AuthMiniAppModule } from '../features/auth/auth-mini-app.module';
// Local files

@Module({
  imports: [AuthMiniAppModule, BannerMiniAppModule],
  exports: [AuthMiniAppModule],
})
export class HomeModule {}
