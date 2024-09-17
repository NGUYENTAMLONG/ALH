import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { InterestListTransactionRepository } from '@repositories/interest-list-transaction.repository';
// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
//Other dependencies
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// Local files
import { CandidateJobType } from '@models/candidate-job-type.model';
import { Enterprise } from '@models/enterprise.model';
import { HirePrice } from '@models/hire-price.model';
import { User } from '@models/user.model';
import { CandidateProvinceRepository } from '@repositories/candidate-province.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { InterestListProvinceRepository } from '@repositories/interest-list-province.repository';
import { InterestListRepository } from '@repositories/interest-list.repository';
import { NotificationService } from '@services/notification.service';
import {
  INTEREST_LIST_STATUS,
  NOTIFICATION_TYPE,
  NotificationPayload,
} from '@utils/constants';
import { convertDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { AdminCreateRecruitmentRequestDto } from '../dto/admin-create-recruitment-request.dto';
import { AdminFilterRecruitmentRequestDto } from '../dto/filter-recruitment-request.dto';

@Injectable()
export class AdminRecruitmentRequestService {
  constructor(
    private readonly interestListRepository: InterestListRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly candidateInformationRepository: CandidateInformationRepository,
    private readonly interestListTransactionRepository: InterestListTransactionRepository,
    private readonly candidateProvinceRepository: CandidateProvinceRepository,
    private readonly interestListProvinceRepository: InterestListProvinceRepository,
    private readonly notificationService: NotificationService,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(dto: AdminFilterRecruitmentRequestDto) {
    let whereCondition: any = {};
    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }

    if (dto.search) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { '$enterprise.name$': { [Op.like]: `%${dto.search}%` } },
          { '$enterprise.salesperson$': { [Op.like]: `%${dto.search}%` } },
          { '$enterprise.user.full_name$': { [Op.like]: `%${dto.search}%` } },
          { '$enterprise.user.email$': { [Op.like]: `%${dto.search}%` } },
          {
            '$enterprise.user.phone_number$': {
              [Op.like]: `%${dto.search}%`,
            },
          },
        ],
      };
    }

    const options: any = {
      attributes: {
        include: [
          [
            this.sequelize.literal(
              `(
              SELECT COUNT(id) FROM interest_list
              WHERE enterprise_id = InterestList.enterprise_id
              AND deleted_at IS NULL
              LIMIT 1
             )`,
            ),
            'recruitment_count',
          ],
        ],
      },
      where: whereCondition,
      include: [
        {
          model: Enterprise,
          include: {
            model: User,
            as: 'user',
          },
        },
      ],
      group: ['enterprise_id'],
      order: [['id', 'DESC']],
    };
    const count = await this.interestListRepository.query(
      'SELECT COUNT(DISTINCT enterprise_id) as count FROM interest_list',
    );
    const { current_page, page_size, total_count, offset } = paginateData(
      count[0][0].count,
      dto.page,
      dto.limit,
    );

    if (dto.page || dto.limit) {
      (options.offset = offset), (options.limit = page_size);
    }

    const recruitment = await this.interestListRepository.findAll(options);
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({
      data: recruitment,
      paging,
    });
  }

  async create(dto: AdminCreateRecruitmentRequestDto) {
    const enterprise = await this.enterpriseRepository.findByPk(
      dto.enterprise_id,
    );
    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const candidateInformation =
      await this.candidateInformationRepository.findAll({
        where: {
          id: { [Op.in]: dto.candidate_information_ids },
        },
        include: [
          {
            model: HirePrice,
          },
          {
            model: CandidateJobType,
          },
          {
            model: User,
          },
        ],
      });
    let successCount = 0;
    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        if (candidateInformation && candidateInformation.length > 0) {
          for (let i = 0; i < candidateInformation.length; i++) {
            try {
              const interestListFound =
                await this.interestListRepository.findOne({
                  where: {
                    candidate_information_id: candidateInformation[i].id,
                    enterprise_id: enterprise.id,
                  },
                });
              if (interestListFound) {
                throw new HttpException(
                  'Ứng viên đã được chọn cho doanh nghiệp này',
                  HttpStatus.CONFLICT,
                );
              }
              const interestList = await this.interestListRepository.create({
                candidate_information_id: candidateInformation[i].id,
                enterprise_id: enterprise.id,
                professional_field_id:
                  candidateInformation[i].professional_field_id,
                hire_price: candidateInformation[i].hire_price.salary,
                job_type_id:
                  candidateInformation[i].candidate_job_type.job_type_id,
                status: INTEREST_LIST_STATUS.WAITING_APPROVE,
              });
              const candidateProvince =
                await this.candidateProvinceRepository.findAll({
                  where: {
                    candidate_information_id: candidateInformation[i].id,
                  },
                });
              if (candidateProvince && candidateProvince.length > 0) {
                const interestListProvinceCreated = candidateProvince.map(
                  (e) => ({
                    interest_list_id: interestList?.id,
                    df_province_id: e.df_province_id,
                  }),
                );
                await this.interestListProvinceRepository.bulkCreate(
                  interestListProvinceCreated,
                  { transaction },
                );
              }
              await this.interestListTransactionRepository.create(
                {
                  candidate_information_id: candidateInformation[i].id,
                  interest_list_id: interestList?.id,
                  status: INTEREST_LIST_STATUS.WAITING_APPROVE,
                  enterprise_id: enterprise.id,
                },
                { transaction },
              );
              const notificationPayload: NotificationPayload = {
                title: 'Admin thêm mới ứng viên quan tâm',
                content: `Ứng viên ${candidateInformation[i].user.full_name} đã được thêm vào danh sách quan tâm`,
                type: NOTIFICATION_TYPE.RENT_CANDIDATE,
                data: { interest_list_id: interestList?.id },
              };
              this.notificationService.createAndSendNotificationForUsers(
                notificationPayload,
                {
                  include_user_ids: [enterprise.user_id],
                },
              );
              successCount = successCount + 1;
            } catch (error) {
              console.log(error);
            }
          }
        }
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể tạo  yêu cầu thuê nhân sự vào lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });

    return sendSuccess({
      msg: `Thêm mới thành công ${successCount} yêu cầu thuê nhân sự `,
    });
  }
}
