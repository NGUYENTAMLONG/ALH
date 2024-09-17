//Nest dependencies
import { Injectable } from '@nestjs/common';
//Local dependencies
import { GenderRepository } from '@repositories/gender.repository';
import { sendSuccess } from '@utils/send-success';

@Injectable()
export class GenderService {
  constructor(private readonly genderRepository: GenderRepository) {}
  async findAll() {
    const gender = await this.genderRepository.findAll();
    return sendSuccess({ data: gender });
  }
}
