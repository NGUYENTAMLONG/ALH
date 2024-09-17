//Nest dependencies
import { Injectable, OnModuleInit } from '@nestjs/common';
// Local files
import { PositionRepository } from '@repositories/position.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { sendSuccess } from '@utils/send-success';
import { POSITIONS } from '../constant/position.constant';

@Injectable()
export class PositionService implements OnModuleInit {
  constructor(
    private readonly positionRepository: PositionRepository,
    private readonly professionalRepository: ProfessionalFieldRepository,
  ) {}

  async onModuleInit() {
    // //version 1
    try {
      const foundPositions = await this.positionRepository.findAll({});
      if (foundPositions?.length === 0) {
        const payloadCreates = POSITIONS.map((elm) => {
          return {
            name: elm,
          };
        });

        await this.positionRepository.bulkCreate(payloadCreates);
        console.log('GENERATED POSITIONS SUCCESSFUL');
      }
    } catch (error) {
      console.log('ERROR GENERATE POSITIONS', error);
    }
  }

  async findAll() {
    const positions = await this.positionRepository.findAll();
    return sendSuccess({ data: positions });
  }

  async findAllProfessionals() {
    const professionals = await this.professionalRepository.findAll();
    return sendSuccess({ data: professionals });
  }
}
