//Nest dependencies
import { Injectable } from '@nestjs/common';
import { DFBankRepository } from '@repositories/df-bank.repository';
import { sendSuccess } from '@utils/send-success';
//Local dependencies

@Injectable()
export class DFBankService {
  constructor(private readonly dFBankRepository: DFBankRepository) {}
  async findAll() {
    const dfBanks = await this.dFBankRepository.findAll();
    return sendSuccess({ data: dfBanks });
  }
}
