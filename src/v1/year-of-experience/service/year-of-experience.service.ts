//Nest dependencies
import { Injectable } from '@nestjs/common';
//Local dependencies
import { YearOfExperienceRepository } from '@repositories/year-of-experience.repository';
import { sendSuccess } from '@utils/send-success';

@Injectable()
export class YearOfExperienceService {
  constructor(
    private readonly yearOfExperienceRepository: YearOfExperienceRepository,
  ) {}
  async findAll() {
    const yearOfExperiences = await this.yearOfExperienceRepository.findAll();
    return sendSuccess({ data: yearOfExperiences });
  }
}
