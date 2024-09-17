// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local files
import { FeeTypeRepository } from '@repositories/fee-type.repository';
import { sendSuccess } from '@utils/send-success';

@Injectable()
export class FeeTypeService {
  constructor(private readonly feeTypeRepository: FeeTypeRepository) {}
  async findAll() {
    const feeType = await this.feeTypeRepository.findAll();
    return sendSuccess({ data: feeType });
  }
}
