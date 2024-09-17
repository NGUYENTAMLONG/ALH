//Nest dependencies
import { Injectable } from '@nestjs/common';
//Local dependencies
import { JobTypeRepository } from '@repositories/job-type.repository';
import { sendSuccess } from '@utils/send-success';

@Injectable()
export class JobTypeService {
  constructor(private readonly jobTypeRepository: JobTypeRepository) {}
  async findAll() {
    const jobType = await this.jobTypeRepository.findAll();
    return sendSuccess({ data: jobType });
  }
}
