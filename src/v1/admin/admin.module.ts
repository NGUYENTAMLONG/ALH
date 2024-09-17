// Nest dependencies
import { Module } from '@nestjs/common';

// Local files
import { FeaturesModule } from './features/features.module';

@Module({
  imports: [FeaturesModule],
  controllers: [],
  providers: [],
  exports: [FeaturesModule],
})
export class AdminModule {}
