// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Local files
import { ProfessionalField } from '@models/professional-field.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class ProfessionalFieldRepository extends BaseRepository<ProfessionalField> {
  constructor() {
    super(ProfessionalField);
  }

  async findProfessionalField(id?: number) {
    try {
      return await this.findByPk(id);
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể tìm thấy lĩnh vực chuyên môn hoặc vị trí công việc lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
