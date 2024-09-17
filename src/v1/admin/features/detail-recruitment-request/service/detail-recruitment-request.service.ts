import { AdminChangeStatusDetailRecruitmentRequestDto } from '../dto/change-status-detail-recruitment-request.dto';
// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
//Other dependencies
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// Local files
import { CandidateInformation } from '@models/candidate-information.model';
import { CandidateJobType } from '@models/candidate-job-type.model';
import { HirePrice } from '@models/hire-price.model';
import { InterestListJobType } from '@models/interest-list-job-type.model';
import { InterestListProvince } from '@models/interest-list-province.model';
import { ProfessionalField } from '@models/professional-field.model';
import { User } from '@models/user.model';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateJobTypeRepository } from '@repositories/candidate-job-type.repository';
import { CandidateProvinceRepository } from '@repositories/candidate-province.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { InterestListJobTypeRepository } from '@repositories/interest-list-job-type.repository';
import { InterestListProvinceRepository } from '@repositories/interest-list-province.repository';
import { InterestListTransactionRepository } from '@repositories/interest-list-transaction.repository';
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
import { AdminCreateDetailRecruitmentRequestDto } from '../dto/create-detail-recruitment-request.dto';
import { AdminFilterDetailRecruitmentRequestDto } from '../dto/filter-detail-recruitment-request.dto';

@Injectable()
export class AdminDetailRecruitmentRequestService {
  constructor(
    private readonly interestListRepository: InterestListRepository,
    private readonly interestListTransactionRepository: InterestListTransactionRepository,
    private readonly notificationService: NotificationService,
    private readonly candidateInformationRepository: CandidateInformationRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly candidateProvinceRepository: CandidateProvinceRepository,
    private readonly interestListProvinceRepository: InterestListProvinceRepository,
    private readonly candidateJobTypeRepository: CandidateJobTypeRepository,
    private readonly interestListJobTypeRepository: InterestListJobTypeRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(dto: AdminFilterDetailRecruitmentRequestDto) {
    const whereCondition: any = {
      enterprise_id: dto.enterprise_id,
      [Op.and]: [],
    };

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }
    if (dto.status) {
      whereCondition.status = dto.status;
    }
    if (dto.df_province_ids) {
      whereCondition[Op.and].push({
        id: {
          [Op.in]: [
            Sequelize.literal(
              `SELECT interest_list_id FROM interest_list_province 
              WHERE df_province_id IN (${dto.df_province_ids})`,
            ),
          ],
        },
      });
    }
    if (dto.professional_field_ids) {
      whereCondition.professional_field_id = {
        [Op.in]: dto.professional_field_ids.split(','),
      };
    }

    if (dto.search) {
      whereCondition[Op.and].push({
        id: {
          [Op.in]: [
            Sequelize.literal(
              `SELECT interest_list.id FROM interest_list 
              JOIN candidate_information ON candidate_information.id = interest_list.candidate_information_id
              JOIN user ON user.id = candidate_information.user_id
              WHERE (user.full_name LIKE '%${dto.search}%' OR user.phone_number LIKE '%${dto.search}%')`,
            ),
          ],
        },
      });
    }

    const options: any = {
      where: whereCondition,
      include: [
        {
          model: CandidateInformation,
          as: 'candidate_information',
          include: {
            model: User,
          },
        },
        {
          model: InterestListProvince,
          attributes: {
            include: [
              [
                this.sequelize.literal(
                  `(
                    SELECT name FROM df_province
                    WHERE id = interest_list_province.df_province_id
                    LIMIT 1
                   )`,
                ),
                'province_name',
              ],
            ],
          },
        },
        {
          model: ProfessionalField,
        },
        {
          model: InterestListJobType,
          attributes: {
            include: [
              [
                this.sequelize.literal(
                  `(
                    SELECT name FROM job_type
                    WHERE id = interest_list_job_type.job_type_id
                    LIMIT 1
                   )`,
                ),
                'job_type_name',
              ],
            ],
          },
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
          include: {
            model: User,
          },
        },
      ],
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
      blocks: {
        status: INTEREST_LIST_STATUS,
      },
      paging,
    });
  }

  async changeStatusDetailRecruitment(
    id: number,
    dto: AdminChangeStatusDetailRecruitmentRequestDto,
  ) {
    const interestList = await this.interestListRepository.findByPk(id);
    if (!interestList) {
      throw new HttpException(
        'ID quan tâm của ứng viên không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }
    const enterprise = await this.enterpriseRepository.findByPk(
      interestList.enterprise_id,
    );
    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
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
      throw new HttpException('Ứng viên không tồn tại', HttpStatus.NOT_FOUND);
    }
    if (interestList.status == dto.status) {
      throw new HttpException(
        'Trạng thái thay đổi phải khác với trạng thái hiện tại của ứng viên',
        HttpStatus.AMBIGUOUS,
      );
    }
    if (dto.status == INTEREST_LIST_STATUS.APPROVE) {
      if (!dto.start_time || !dto.end_time) {
        throw new HttpException(
          'Vui lòng nhập thời gian bắt đầu thời gian kết thúc',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      if (dto.end_time || dto.start_time) {
        throw new HttpException(
          'Vui lòng không nhập thời gian bắt đầu thời gian kết thúc',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      await interestList.update(
        {
          status: dto.status,
          start_time: dto.start_time,
          end_time: dto.end_time,
        },
        { transaction },
      );
      await this.interestListTransactionRepository.create(
        {
          candidate_information_id: interestList.candidate_information_id,
          interest_list_id: interestList.id,
          enterprise_id: interestList.enterprise_id,
          status: dto.status,
          note: dto.note,
        },
        { transaction },
      );
    });
    let title = '';
    let content = '';
    if (dto.status == INTEREST_LIST_STATUS.APPROVE) {
      title = 'Admin xác nhận Duyệt ứng viên';
      content = `Ứng viên ${candidate.user.full_name} đã được duyệt`;
    } else if (dto.status == INTEREST_LIST_STATUS.IN_CONTACT) {
      title = 'Admin xác nhận Đang liên hệ ứng viên';
      content = `Ứng viên ${candidate.user.full_name} đang được liên hệ`;
    } else if (dto.status == INTEREST_LIST_STATUS.REJECT) {
      title = 'Admin xác nhận Từ chối ứng viên';
      content = `Ứng viên ${candidate.user.full_name} đã bị từ chối`;
    } else if (dto.status == INTEREST_LIST_STATUS.EXPIRE) {
      title = 'Admin xác nhận Hết hạn ứng viên ';
      content = `Nhân viên ${candidate.user.full_name} đã hết hạn`;
    }
    const notificationPayload: NotificationPayload = {
      title,
      content,
      type: NOTIFICATION_TYPE.RENT_CANDIDATE,
      data: { interest_list_id: interestList.id },
    };
    this.notificationService.createAndSendNotificationForUsers(
      notificationPayload,
      {
        include_user_ids: [enterprise.user_id],
      },
    );
    await interestList.reload();
    return sendSuccess({
      data: interestList,
      msg: 'Thay đổi trạng thái thành công',
    });
  }

  async create(dto: AdminCreateDetailRecruitmentRequestDto) {
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
      await this.candidateInformationRepository.findOne({
        where: {
          id: dto.candidate_information_id,
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
    if (!candidateInformation) {
      throw new HttpException(
        'Ứng viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const interestListFound = await this.interestListRepository.findOne({
      where: {
        candidate_information_id: dto.candidate_information_id,
        enterprise_id: enterprise.id,
      },
    });
    if (interestListFound) {
      throw new HttpException(
        'Ứng viên đã được chọn cho doanh nghiệp này',
        HttpStatus.CONFLICT,
      );
    }
    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        const interestList = await this.interestListRepository.create({
          candidate_information_id: candidateInformation.id,
          enterprise_id: enterprise.id,
          professional_field_id: candidateInformation.professional_field_id,
          hire_price: candidateInformation.hire_price.salary,
          status: INTEREST_LIST_STATUS.WAITING_APPROVE,
        });
        const candidateProvince =
          await this.candidateProvinceRepository.findAll({
            where: {
              candidate_information_id: candidateInformation.id,
            },
          });
        if (candidateProvince && candidateProvince.length > 0) {
          const interestListProvinceCreated = candidateProvince.map((e) => ({
            interest_list_id: interestList?.id,
            df_province_id: e.df_province_id,
          }));
          await this.interestListProvinceRepository.bulkCreate(
            interestListProvinceCreated,
            { transaction },
          );
        }

        const candidateJobType = await this.candidateJobTypeRepository.findAll({
          where: {
            candidate_information_id: candidateInformation.id,
          },
        });
        if (candidateJobType && candidateJobType.length > 0) {
          const interestListJobTypeCreated = candidateJobType.map((e) => ({
            interest_list_id: interestList?.id,
            job_type_id: e.job_type_id,
          }));
          await this.interestListJobTypeRepository.bulkCreate(
            interestListJobTypeCreated,
            { transaction },
          );
        }
        await this.interestListTransactionRepository.create(
          {
            candidate_information_id: candidateInformation.id,
            interest_list_id: interestList?.id,
            status: INTEREST_LIST_STATUS.WAITING_APPROVE,
            enterprise_id: enterprise.id,
          },
          { transaction },
        );
        const notificationPayload: NotificationPayload = {
          title: 'Admin thêm mới ứng viên quan tâm',
          content: `Ứng viên ${candidateInformation.user.full_name} đã được thêm vào danh sách quan tâm`,
          type: NOTIFICATION_TYPE.RENT_CANDIDATE,
          data: { interest_list_id: interestList?.id },
        };
        this.notificationService.createAndSendNotificationForUsers(
          notificationPayload,
          {
            include_user_ids: [enterprise.user_id],
          },
        );
      } catch (error) {
        throw new HttpException(
          'Có lỗi xảy ra không thể tạo  yêu cầu thuê nhân sự vào lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });

    return sendSuccess({
      msg: 'Thêm mới yêu cầu thuê nhân sự thành công',
    });
  }
}
