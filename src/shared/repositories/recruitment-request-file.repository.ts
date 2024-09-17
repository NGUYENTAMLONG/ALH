// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Local files
import { RecruitmentRequestFile } from '@models/recruitment-request-file.model';
import { generateUniqueWEPKey } from '@utils/generate-code-recruitment';
import { BaseRepository } from './base.repository';

@Injectable()
export class RecruitmentRequestFileRepository extends BaseRepository<RecruitmentRequestFile> {
  constructor() {
    super(RecruitmentRequestFile);
  }

  async createCodeRecruitment() {
    try {
      const code = generateUniqueWEPKey();
      let foundCode;
      do {
        foundCode = await this.findCodeRecruitment(code);
      } while (foundCode);

      return code;
    } catch (error) {
      throw new HttpException(
        'Có lỗi xảy ra không thể lấy dữ liệu recruiment lúc này',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findCodeRecruitment(code: string) {
    return await this.findOne({
      where: {
        code,
      },
    });
  }
}
