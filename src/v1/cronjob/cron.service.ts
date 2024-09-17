// cron.service.ts
import { Injectable } from '@nestjs/common';
import * as cron from 'cron';
import { Op } from 'sequelize';
import * as moment from 'moment';
import { CronTime, GlobalTime } from './config';

import axios from 'axios';

import * as _ from 'lodash';
import { RecruitmentRequirement } from '@models/recruitment-requirement.model';
import { User } from '@models/user.model';
import { recruitmentExpireTemplate } from 'src/shared/zalo-templates/templates';
import { sendZaloMessage } from '@utils/send-zalo-message';
import { RECRUITMENT_STATUS } from '@utils/constants';

@Injectable()
export class CronService {
  private readonly cronJobs: cron.CronJob[];

  constructor() {
    this.cronJobs = [];

    const oneSecondJob = new cron.CronJob(CronTime.EverySecond.rule, () => {
      console.log('Good morning!');
    });

    const sendJobExpiredToHR = new cron.CronJob(
      CronTime.EveryDayAtEightAm.rule,
      async () => {
        await this.sendJobExpiredToHrWorker();
      },
    );

    this.cronJobs.push(sendJobExpiredToHR);
    // this.cronJobs.push(handleSendInterestJob);

    // Bắt đầu các cron job
    this.cronJobs.forEach((job) => job.start());
  }

  // Tắt tất cả các cron job khi ứng dụng dừng
  stopCronJobs() {
    this.cronJobs.forEach((job) => job.stop());
  }

  async sendJobExpiredToHrWorker(): Promise<any> {
    try {
      //Tìm các tin tuyển dụng sắp hết hạn (cách ngày hết hạn 3 hoặc 1 ngày)
      const recruitments = await RecruitmentRequirement.findAll({
        where: {
          apply_deadline: {
            [Op.or]: [
              {
                [Op.gte]: moment().add(1, 'days').startOf('day'),
                [Op.lte]: moment().add(1, 'days').endOf('day'),
              },
              {
                [Op.gte]: moment().add(3, 'days').startOf('day'),
                [Op.lte]: moment().add(3, 'days').endOf('day'),
              },
            ],
          },
          status: RECRUITMENT_STATUS.PROCESSED,
        },
      });

      const messages = [];
      for (const recruitment of recruitments) {
        const foundUserCreated = await User.findOne({
          where: {
            id: recruitment.created_by,
          },
        });
        if (foundUserCreated?.phone_number) {
          const content = recruitmentExpireTemplate(
            foundUserCreated?.full_name,
            recruitment.position_input,
            recruitment.modify_date_processed,
            recruitment.apply_deadline,
            `https://zalo.me/s/1312390836269348201/detailjob/${recruitment.id}?type=2`,
          );
          messages.push({
            phone: foundUserCreated?.phone_number,
            name: foundUserCreated?.full_name,
            message: content,
            list_image: [],
          });
        }
      }

      if (messages.length > 0) {
        // console.log({ messages });
        await sendZaloMessage({ messages });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Test API
  async sendTestNoti(): Promise<any> {
    try {
    } catch (error) {
      console.log(error);
    }
  }
}
