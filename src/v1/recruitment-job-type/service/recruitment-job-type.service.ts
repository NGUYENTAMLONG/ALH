import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RecruitmentJobTypeRepository } from '@repositories/recruitment-job-type.repository';

@Injectable()
export class RecruitmentJobTypeService {
  constructor(
    private readonly recruitmentJobTypeRepository: RecruitmentJobTypeRepository,
  ) {}

  async findRecruitmentJobType(id: number) {
    try {
      return await this.recruitmentJobTypeRepository.findOne({
        where: {
          recruitment_requirement_id: id,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể danh sách hình thức làm việc theo id lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
