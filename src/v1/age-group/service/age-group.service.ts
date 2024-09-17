//Nest dependencies
import { Injectable } from '@nestjs/common';
//Local dependencies
import { AgeGroupRepository } from '@repositories/age-group.repository';
import { sendSuccess } from '@utils/send-success';

@Injectable()
export class AgeGroupService {
  constructor(private readonly ageGroupRepository: AgeGroupRepository) {}
  async findAll() {
    const ageGroup = await this.ageGroupRepository.findAll();
    return sendSuccess({ data: ageGroup });
  }
}
