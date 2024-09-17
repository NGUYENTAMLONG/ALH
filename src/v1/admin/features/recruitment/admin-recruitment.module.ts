//Nest dependencies
import { Module } from '@nestjs/common';
//Local files
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { RecruitmentRequestFileRepository } from '@repositories/recruitment-request-file.repository';
import { WebsocketModule } from '@services/module/websocket.module';
import { AdminRecruitmentController } from './controller/admin-recruitment.controller';
import { AdminRecruitmentService } from './service/admin-recruitment.service';

@Module({
  imports: [WebsocketModule],
  controllers: [AdminRecruitmentController],
  providers: [
    AdminRecruitmentService,
    RecruitmentRequestFileRepository,
    EnterpriseRepository,
  ],
})
export class AdminRecruitmentModule {}
