import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InterestListTransactionRepository } from '@repositories/interest-list-transaction.repository';
import { InterestListRepository } from '@repositories/interest-list.repository';
import { INTEREST_LIST_STATUS } from '@utils/constants';
import * as dayjs from 'dayjs';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UpdateStatusInterestLitsService {
  constructor(
    private readonly interestListRepository: InterestListRepository,
    private readonly interestListTransactionRepository: InterestListTransactionRepository,
    private readonly sequelize: Sequelize,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async updateStatusCron() {
    const currentDate = dayjs().format('YYYY-MM-DD');
    const interestList = await this.interestListRepository.findAll({
      where: {
        status: INTEREST_LIST_STATUS.APPROVE,
        end_time: { [Op.lte]: currentDate },
      },
    });
    interestList?.map(async (item) => {
      await this.sequelize.transaction(async (transaction: Transaction) => {
        await this.interestListRepository.update(
          {
            status: INTEREST_LIST_STATUS.EXPIRE,
            start_time: null,
            end_time: null,
          },
          {
            where: {
              id: item.id,
            },
            transaction,
          },
        );
        await this.interestListTransactionRepository.create(
          {
            interest_list_id: item.id,
            candidate_information_id: item.candidate_information_id,
            enterprise_id: item.enterprise_id,
            status: INTEREST_LIST_STATUS.EXPIRE,
          },
          { transaction },
        );
      });
    });
  }
}
