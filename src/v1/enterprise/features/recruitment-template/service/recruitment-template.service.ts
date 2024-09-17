// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { RecruitmentTemplateRepository } from '@repositories/recruitment-template.repository';
import { sendSuccess } from '@utils/send-success';

@Injectable()
export class RecruitmentTemplateService {
  constructor(
    private readonly recruitmentTemplateRepository: RecruitmentTemplateRepository,
  ) {}

  async findAll() {
    const recruitmentTemplate =
      await this.recruitmentTemplateRepository.findAllIdName();

    return sendSuccess({
      data: recruitmentTemplate,
    });
  }

  async findOne(id: number) {
    const recruitmentTemplate =
      await this.recruitmentTemplateRepository.findRecruitmentTemplate(id);

    return sendSuccess({
      data: recruitmentTemplate,
    });
  }
}
