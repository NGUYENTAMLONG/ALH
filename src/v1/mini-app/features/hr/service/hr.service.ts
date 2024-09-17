//Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
//Local files
import { RecruitmentRequirementRepository } from '@repositories/recruitment-requirement.repository';
import { sendSuccess } from '@utils/send-success';
import _ from 'lodash';
import { UserRecruitmentFavoriteRepository } from '@repositories/user-recruitment-favorite.repository';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateInterestRepository } from '@repositories/candidate-interest.repository';
import { CandidateInterestCareerRepository } from '@repositories/candidate-interest-career.repository';
import { UserRepository } from '@repositories/user.repository';
import { CandidateInformation } from '@models/candidate-information.model';
import { CandidateInterest } from '@models/candidate-interest.model';
import { CandidateInterestCareer } from '@models/candidate-interest-career.model';
import { DFDegree } from '@models/df-degree.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { Position } from '@models/position.model';
import { SalaryRange } from '@models/salary-range.model';
import {
  CANDIDATE_RECRUITMENT_STATUS,
  RECRUITMENT_STATUS,
} from '@utils/constants';
import {
  HRFilterDetailPointDto,
  MiniAppFilterCandidateAppliedDto,
  MiniAppSelectRecruitmentDto,
} from '../dto/hr.dto';
import { convertDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { RecruitmentRequirement } from '@models/recruitment-requirement.model';
import { User } from '@models/user.model';
import { RecruitmentRequirementFileRepository } from '@repositories/recruitment-requirement-file.repository';
import { CandidateRecruitmentRepository } from '@repositories/candidate-recruitment.repository';
import { CandidateApplyFileRepository } from '@repositories/candidate-apply-file.repository';
import { CandidateApplyRepository } from '@repositories/candidate-apply.repository';
import { UserPointRepository } from '@repositories/user-point.repository';
import { Enterprise } from '@models/enterprise.model';
import { UserPointHistoryRepository } from '@repositories/user-point-history.repository';
import { CandidateApplyFile } from '@models/candidate-apply-file.model';

@Injectable()
export class MiniAppHRService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly userRepository: UserRepository,
    private readonly recruitmentRequirementRepository: RecruitmentRequirementRepository,
    private readonly candidateRequirementRepository: CandidateRecruitmentRepository,
    private readonly candidateApplyRepository: CandidateApplyRepository,
    private readonly candidateApplyFileRepository: CandidateApplyFileRepository,
    private readonly recruitmentRequirementFileRepository: RecruitmentRequirementFileRepository,
    private readonly userPointRepository: UserPointRepository,
    private readonly userPointHistoryRepository: UserPointHistoryRepository,
  ) {}

  async getCandidateApplied(
    user_id: number,
    dto: MiniAppFilterCandidateAppliedDto,
  ) {
    // Tìm tất cả các job recruitment đã đăng tuyển
    let recruitmentIds: any = '';
    if (dto?.recruitment_ids) {
      const recruitmentIdsArray: any = dto.recruitment_ids
        ?.split(',')
        .map((id) => parseInt(id));

      recruitmentIds = recruitmentIdsArray;
    } else {
      const foundAllRecruitments =
        await this.recruitmentRequirementRepository.findAll({
          where: {
            created_by: user_id,
          },
          attributes: ['id', 'code', 'created_by'],
        });
      recruitmentIds = foundAllRecruitments?.map((elm) => elm?.id) || [];
    }

    const whereCondition: any = {
      [Op.and]: [
        {
          recruitment_requirement_id: recruitmentIds,
        },
      ],
    };

    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }

    if (dto.status) {
      whereCondition.status = { [Op.in]: dto.status.split(',') };
    }

    if (dto.search) {
      // whereCondition[Op.and].push({
      //   [Op.or]: [
      //     {
      //       position_input: { [Op.like]: `%${dto.search}%` },
      //     },
      //   ],
      // });
    }

    const includeCountOptions: any = [
      {
        model: RecruitmentRequirement,
      },
      {
        model: CandidateInformation,
        as: 'candidate_information',
        include: [
          {
            model: User,
          },
        ],
      },
    ];
    const includeOptions: any = [
      {
        model: RecruitmentRequirement,
      },
      {
        model: CandidateInformation,
        as: 'candidate_information',
        include: [
          {
            model: User,
          },
        ],
      },
    ];

    const options: any = {
      where: whereCondition,
      attributes: {
        include: [],
      },
      include: includeOptions,
      order: ['status', ['updated_at', 'DESC']],
    };
    const countOptions: any = {
      where: whereCondition,
      // include: includeCountOptions,
    };

    const count = await this.candidateRequirementRepository.count(countOptions);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const candidateRecruitments: any =
      await this.candidateRequirementRepository.findAll(options);

    // Lác cv của ứng viên đã ứng tuyển tương ứng
    for (const elm of candidateRecruitments) {
      elm.dataValues.files_applied =
        await this.candidateApplyRepository.findAll({
          where: {
            candidate_information_id: elm?.candidate_information_id,
            candidate_recruitment_id: elm?.id,
          },
          include: [
            {
              model: CandidateApplyFile,
            },
          ],
        });
    }

    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };

    return sendSuccess({
      data: candidateRecruitments,
      blocks: {
        status: CANDIDATE_RECRUITMENT_STATUS,
      },
      paging,
    });
  }

  async detail(id: number, dto: HRFilterDetailPointDto) {
    const userPoint = await this.userPointRepository.findOne({
      where: { user_id: id },
      include: { model: User },
    });
    if (!userPoint) {
      throw new HttpException(
        'Điểm không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const whereCondition: any = {
      user_point_id: userPoint.id,
    };
    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }
    if (dto.status) {
      whereCondition.mutable_type = dto.status;
    }
    const options: any = {
      where: whereCondition,
      include: [
        { model: User },
        { model: RecruitmentRequirement, include: { model: Enterprise } },
        {
          model: CandidateInformation,
          as: 'candidate_information',
          include: { model: User },
        },
      ],
      order: [['id', 'DESC']],
    };
    const count = await this.userPointHistoryRepository.count(options);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const userPointHistory = await this.userPointHistoryRepository.findAll(
      options,
    );
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({
      data: { user_point: userPoint, user_point_history: userPointHistory },
      paging,
    });
  }

  async getAllSelectRecruitment(
    user_id: number,
    dto: MiniAppSelectRecruitmentDto,
  ) {
    // Tìm tất cả các job recruitment đã đăng tuyển
    const whereCondition: any = {
      [Op.and]: [
        {
          position_input: {
            [Op.ne]: null,
          },
        },
        {
          created_by: user_id,
        },
        {
          status: RECRUITMENT_STATUS.PROCESSED,
        },
      ],
    };

    if (dto?.recruitment_ids) {
      const recruitmentIdsArray: any = dto.recruitment_ids
        ?.split(',')
        .map((id) => parseInt(id));

      whereCondition[Op.and].push({
        [Op.or]: [
          {
            id: recruitmentIdsArray,
          },
        ],
      });
    }

    if (dto.search) {
      whereCondition[Op.and].push({
        [Op.or]: [
          {
            position_input: { [Op.like]: `%${dto.search}%` },
          },
        ],
      });
    }

    const recruitments: any =
      await this.recruitmentRequirementRepository.findAll({
        where: whereCondition,
        attributes: ['id', 'position_input', 'status'],
        order: ['status', ['updated_at', 'DESC']],
      });

    return sendSuccess({
      data: recruitments,
      blocks: {
        status: CANDIDATE_RECRUITMENT_STATUS,
      },
    });
  }
}
