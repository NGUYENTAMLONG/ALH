//Nest dependencies
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DFCareerRepository } from '@repositories/df-career.repository';
import { sendSuccess } from '@utils/send-success';
import { GROUP_CAREERS } from '../constant/df-career.constant';
import { DFCareer } from '@models/df-career.model';
import { DFGroupCareer } from '@models/df-group-career.model';
//Local dependencies

@Injectable()
export class DFCareerService implements OnModuleInit {
  constructor(private readonly dFCareerRepository: DFCareerRepository) {}

  async onModuleInit() {
    // //version 1
    // try {
    //   const foundDfCareers = await DFCareer.findAll({});
    //   if (foundDfCareers?.length === 0) {
    //     const payloadCreates = CAREERS.map((elm) => {
    //       return {
    //         name: elm,
    //       };
    //     });
    //     await this.dFCareerRepository.bulkCreate(payloadCreates);
    //     console.log('GENERATED CAREERS SUCCESSFUL');
    //   }
    // } catch (error) {
    //   console.log('ERROR GENERATE CAREERS', error);
    // }

    // //version 2
    try {
      const foundDfCareers = await DFCareer.findAll({});
      const foundDfGroupCareers = await DFGroupCareer.findAll({});
      if (foundDfCareers?.length === 0 && foundDfGroupCareers?.length === 0) {
        // Prepare the data for df_group_career
        const groupCareersData = GROUP_CAREERS.map((groupCareer) => ({
          name: groupCareer.name,
        }));

        // Insert data into df_group_career
        const groupCareers = await DFGroupCareer.bulkCreate(groupCareersData, {
          returning: true,
        });

        // Prepare the data for df_career
        const careersData: any = [];
        GROUP_CAREERS.forEach((groupCareer, index) => {
          groupCareer.careers.forEach((career) => {
            careersData.push({
              name: career,
              group_career_id: groupCareers[index].id,
            });
          });
        });

        // Insert data into df_career
        await DFCareer.bulkCreate(careersData);
        console.log('GENERATED CAREERS SUCCESSFUL');
      }
    } catch (error) {
      console.log('ERROR GENERATE CAREERS', error);
    }
  }
  async findAll() {
    const dfCareers = await this.dFCareerRepository.findAll();
    return sendSuccess({ data: dfCareers });
  }
}
