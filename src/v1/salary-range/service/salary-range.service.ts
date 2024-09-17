//Nest dependencies
import { Injectable } from '@nestjs/common';
//Local dependencies
import { SalaryRangeRepository } from '@repositories/salary-range.repository';
import { sendSuccess } from '@utils/send-success';

@Injectable()
export class SalaryRangeService {
  constructor(private readonly salaryRangeRepository: SalaryRangeRepository) {}
  async findAll() {
    const salaryRange = await this.salaryRangeRepository.findAll();
    return sendSuccess({ data: salaryRange });
  }
}
