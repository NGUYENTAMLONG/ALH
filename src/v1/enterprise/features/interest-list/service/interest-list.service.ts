// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other files
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// Local files
import { AgeGroup } from '@models/age-group.model';
import { CandidateInformationFile } from '@models/candidate-information-file.model';
import { CandidateInformation } from '@models/candidate-information.model';
import { CandidateJobType } from '@models/candidate-job-type.model';
import { CandidateProvince } from '@models/candidate-province.model';
import { User } from '@models/user.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { AgeGroupRepository } from '@repositories/age-group.repository';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateJobTypeRepository } from '@repositories/candidate-job-type.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { InterestListTransactionRepository } from '@repositories/interest-list-transaction.repository';
import { InterestListRepository } from '@repositories/interest-list.repository';
import { NotificationService } from '@services/notification.service';
import {
  INTEREST_LIST_STATUS,
  IS_ACTIVE,
  NOTIFICATION_TYPE,
  NotificationPayload,
  ROLE,
  TYPE_CALL_HOUR,
} from '@utils/constants';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { EnterpriseAddCandidateInterestListDto } from '../dto/add-candidate-interest-list.dto';
import { EnterpriseFilterInterestListDto } from './../dto/filter-interest-list.dto';

@Injectable()
export class EnterpriseInterestListService {
  constructor(
    private readonly interestListRepository: InterestListRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly interestListTransactionRepository: InterestListTransactionRepository,
    private readonly candidateInformationRepository: CandidateInformationRepository,
    private readonly notificationService: NotificationService,
    private readonly candidateJobTypeRepository: CandidateJobTypeRepository,
    private readonly ageGroupRepository: AgeGroupRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(
    user_id: number,
    dto: EnterpriseFilterInterestListDto,
  ): Promise<any> {
    const enterprise = await this.enterpriseRepository.findEnterprise(user_id);

    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const whereCondition: any = {
      enterprise_id: enterprise.id,
      [Op.and]: [],
    };
    if (dto.search) {
      whereCondition[Op.and].push({
        id: {
          [Op.in]: [
            Sequelize.literal(
              `SELECT interest_list.id FROM interest_list 
              JOIN candidate_information ON candidate_information.id = interest_list.candidate_information_id
              JOIN user ON user.id = candidate_information.user_id
              WHERE (user.full_name LIKE '%${dto.search}%' OR user.phone_number LIKE '%${dto.search}%' OR candidate_information.professional_field LIKE '%${dto.search}%')
              AND interest_list.deleted_at IS NULL`,
            ),
          ],
        },
      });
    }
    if (dto.type && dto.type == TYPE_CALL_HOUR.CALL) {
      whereCondition[Op.and].push({
        type_on_call: IS_ACTIVE.ACTIVE,
      });
    } else if (dto.type && dto.type == TYPE_CALL_HOUR.HOUR) {
      whereCondition[Op.and].push({
        type_on_hour: IS_ACTIVE.ACTIVE,
      });
    }

    if (dto.job_type) {
      const candidateJobType = await this.candidateJobTypeRepository.findAll({
        where: {
          job_type_id: dto.job_type,
        },
        include: {
          model: CandidateInformation,
          as: 'candidate_information',
          required: true,
        },
      });
      if (candidateJobType && candidateJobType.length > 0) {
        const candidateIDs = candidateJobType.map(
          (e) => e.candidate_information_id,
        );
        whereCondition[Op.and].push({
          candidate_information_id: { [Op.in]: candidateIDs },
        });
      } else {
        whereCondition[Op.and].push({
          candidate_information_id: { [Op.in]: [] },
        });
      }
    }
    if (dto.budget_min && dto.budget_max) {
      const foundCandidate = await this.candidateInformationRepository.findAll({
        where: {
          is_hire: IS_ACTIVE.ACTIVE,
          budget_min: { [Op.gte]: dto.budget_min },
          budget_max: { [Op.lte]: dto.budget_max },
        },
      });
      if (foundCandidate && foundCandidate.length > 0) {
        whereCondition[Op.and].push({
          candidate_information_id: {
            [Op.in]: foundCandidate.map((e) => e.id),
          },
        });
      } else {
        whereCondition[Op.and].push({
          candidate_information_id: { [Op.in]: [] },
        });
      }
    }
    const conditions: any[] = [];
    if (dto.age_group_ids) {
      const ageGroup: AgeGroup[] | null = await this.ageGroupRepository.findAll(
        {
          where: {
            id: { [Op.in]: dto.age_group_ids.split(',') },
          },
        },
      );
      if (ageGroup && ageGroup.length > 0) {
        for (let i = 0; i < ageGroup.length; i++) {
          const currentDate = new Date();
          const minBirthDate = new Date(
            currentDate.getFullYear() - ageGroup[i].max_age,
            currentDate.getMonth(),
            currentDate.getDate(),
          );
          const maxBirthDate = new Date(
            currentDate.getFullYear() - ageGroup[i].min_age,
            currentDate.getMonth(),
            currentDate.getDate(),
          );
          conditions.push({
            date_of_birth: { [Op.between]: [minBirthDate, maxBirthDate] },
          });
        }
      }
    }

    const options: any = {
      where: whereCondition,
      include: [
        {
          model: CandidateInformation,
          as: 'candidate_information',
          required: true,
          include: [
            {
              model: User,
              where: {
                ...(conditions.length > 0 ? { [Op.or]: conditions } : {}),
              },
            },
            {
              model: YearOfExperience,
            },
            {
              model: CandidateProvince,
              attributes: {
                include: [
                  [
                    this.sequelize.literal(
                      `(
                        SELECT name FROM df_province
                        WHERE id = \`candidate_information->candidate_province\`.df_province_id
                        LIMIT 1
                       )`,
                    ),
                    'province_name',
                  ],
                ],
              },
            },
            {
              model: CandidateJobType,
              attributes: {
                include: [
                  [
                    this.sequelize.literal(
                      `(
                        SELECT name FROM job_type
                        WHERE id = \`candidate_information->candidate_job_type\`.job_type_id
                        LIMIT 1
                       )`,
                    ),
                    'job_type_name',
                  ],
                ],
              },
            },
            {
              model: CandidateInformationFile,
            },
          ],
        },
      ],
      order: [['id', 'DESC']],
    };
    const countOptions: any = {
      where: whereCondition,
      include: [
        {
          model: CandidateInformation,
          as: 'candidate_information',
          required: true,
          include: [
            {
              model: User,
              where: {
                ...(conditions.length > 0 ? { [Op.or]: conditions } : {}),
              },
            },
            {
              model: YearOfExperience,
            },
          ],
        },
      ],
      order: [['id', 'DESC']],
    };
    const count = await this.interestListRepository.count(countOptions);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    if (dto.page || dto.limit) {
      (options.offset = offset), (options.limit = page_size);
    }

    const interestList = await this.interestListRepository.findAll(options);
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({
      data: interestList,
      paging,
    });
  }

  async countCandidate(user_id: number): Promise<any> {
    const enterprise = await this.enterpriseRepository.findEnterprise(user_id);

    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const whereCondition: any = {
      enterprise_id: enterprise.id,
    };
    const options: any = {
      where: whereCondition,
      order: [['id', 'DESC']],
    };
    const count = await this.interestListRepository.count(options);

    return sendSuccess({ data: count });
  }

  async changeStatus(user_id: number, id: number): Promise<any> {
    const enterprise = await this.enterpriseRepository.findEnterprise(user_id);

    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const interestList = await this.interestListRepository.findByPk(id);
    if (!interestList) {
      throw new HttpException(
        'ID quan tâm của ứng viên không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    if (interestList.enterprise_id != enterprise.id) {
      throw new HttpException(
        'Ứng viên không tồn tại trong doanh nghiệp',
        HttpStatus.NOT_FOUND,
      );
    }
    const candidate = await this.candidateInformationRepository.findOne({
      where: {
        id: interestList.candidate_information_id,
      },
      include: {
        model: User,
      },
    });
    if (!candidate) {
      throw new HttpException(
        'Ứng viên không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      await interestList.update(
        { status: INTEREST_LIST_STATUS.WAITING_APPROVE, note: null },
        { transaction },
      );
      await this.interestListTransactionRepository.create(
        {
          candidate_information_id: interestList.candidate_information_id,
          interest_list_id: interestList.id,
          enterprise_id: interestList.enterprise_id,
          status: INTEREST_LIST_STATUS.WAITING_APPROVE,
        },
        { transaction },
      );
    });
    const notificationPayload: NotificationPayload = {
      title: 'Doanh nghiệp xác nhận tuyển lại nhân viên hết hạn',
      content: `Nhân viên hết hạn ${candidate.user.full_name} đang chờ xác nhận `,
      type: NOTIFICATION_TYPE.RE_RECRUITMENT,
      data: {
        interest_list_id: interestList?.id,
        candidate_information_id: candidate.id,
      },
    };
    this.notificationService.createAndSendNotificationForUsers(
      notificationPayload,
      {
        role_id: [ROLE.ADMIN],
      },
    );
    await interestList.reload();
    return sendSuccess({
      data: interestList,
      msg: 'Tuyển lại ứng viên thành công',
    });
  }

  async updateStatus(
    user_id: number,
    dto: EnterpriseAddCandidateInterestListDto,
  ): Promise<any> {
    const enterprise = await this.enterpriseRepository.findEnterprise(user_id);

    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const foundInterestList = await this.interestListRepository.findOne({
      where: {
        candidate_information_id: dto.candidate_id,
        enterprise_id: enterprise.id,
      },
    });
    await this.sequelize.transaction(async (transaction: Transaction) => {
      if (!foundInterestList) {
        await this.interestListRepository.create(
          {
            candidate_information_id: dto.candidate_id,
            enterprise_id: enterprise.id,
          },
          { transaction },
        );
      } else {
        await foundInterestList.destroy({ transaction });
      }
    });
    let msg = `Thêm ứng viên vào danh sách quan tâm thành công`;
    if (foundInterestList) {
      msg = 'Xóa ứng viên khỏi danh sách quan tâm thành công';
    }
    return sendSuccess({
      msg,
    });
  }
}
