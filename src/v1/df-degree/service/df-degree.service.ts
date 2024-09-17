//Nest dependencies
import { Injectable, OnModuleInit } from '@nestjs/common';
import { sendSuccess } from '@utils/send-success';
import { DFDegreeRepository } from '@repositories/df-degree.repository';
import { DEGREES } from '../constant/df-degree.constant';
import { DFDegree } from '@models/df-degree.model';
//Local dependencies

@Injectable()
export class DFDegreeService implements OnModuleInit {
  constructor(private readonly dFDegreeRepository: DFDegreeRepository) {}

  async onModuleInit() {
    try {
      const foundDfDegrees = await DFDegree.findAll({});
      if (foundDfDegrees?.length === 0) {
        const payloadCreates = DEGREES.map((elm) => {
          return {
            name: elm,
          };
        });
        await this.dFDegreeRepository.bulkCreate(payloadCreates);
        console.log('GENERATED DEGREE SUCCESSFUL');
      }
    } catch (error) {
      console.log('ERROR GENERATE DEGREE', error);
    }
  }
  async findAll() {
    const dfDegrees = await this.dFDegreeRepository.findAll();
    return sendSuccess({ data: dfDegrees });
  }
}
