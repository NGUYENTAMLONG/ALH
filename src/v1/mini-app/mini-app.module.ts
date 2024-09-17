// Nest dependencies
import { Module } from '@nestjs/common';
import { FeaturesModule } from './features/features.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [FeaturesModule, HomeModule],
  controllers: [],
  providers: [],
  exports: [FeaturesModule],
})
export class MiniAppModule {}
