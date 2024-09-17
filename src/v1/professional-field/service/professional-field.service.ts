// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Local dependencies
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { sendSuccess } from '@utils/send-success';

@Injectable()
export class ProfessionalFieldService {
  constructor(
    private readonly professionalRepository: ProfessionalFieldRepository,
  ) {}

  async findProfessionalField(id: number) {
    try {
      return await this.professionalRepository.findByPk(id);
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy dữ liệu chi tiết lĩnh vực chuyên môn lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    const professionalField = await this.professionalRepository.findAll();
    return sendSuccess({ data: professionalField });
  }
}
