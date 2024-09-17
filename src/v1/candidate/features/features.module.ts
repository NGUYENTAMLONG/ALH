// Nest dependencies
import { Module } from '@nestjs/common';

// Local files
import { AuthCandidateModule } from './auth/auth-candidate.module';
import { CandidateRecruitmentModule } from './recruitment/recruitment.module';
@Module({
  imports: [AuthCandidateModule, CandidateRecruitmentModule],
})
export class FeaturesModule {}
